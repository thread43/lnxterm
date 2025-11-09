package container

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"

	"github.com/docker/docker/api/types"
	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

func WsOpenContainerTerminal(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

	var err error

	var server_id string
	var container_id string
	var command string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = request.FormValue("container_id")
	command = request.FormValue("command")

	if util.IsNotSet(server_id, container_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(server_id) {
		util.Api(response, 400)
		return
	}

	var server_id2 int64
	server_id2, err = strconv.ParseInt(server_id, 10, 64)
	util.Raise(err)

	var host string
	host, err = docker_common.GetServerHost(server_id2)
	util.Raise(err)

	var upgrader = websocket.Upgrader{}
	upgrader = websocket.Upgrader{
		CheckOrigin: func(request *http.Request) bool { return true },
	}

	var ws *websocket.Conn
	ws, err = upgrader.Upgrade(response, request, nil)
	util.Raise(err)
	defer func() {
		_ = ws.Close()
		log.Println("websocket closed......")
	}()

	// command = "sh"
	if command == "" {
		err = TestShell(host, container_id)
		if err == nil {
			command = "bash"
		} else {
			command = "sh"
		}
	}

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	log.Println("ContainerExecCreate......")
	var exec_create_response types_container.ExecCreateResponse
	exec_create_response, err = docker_client.ContainerExecCreate(
		context.Background(),
		container_id,
		types_container.ExecOptions{
			AttachStdin:  true,
			AttachStdout: true,
			AttachStderr: true,
			Tty:          true,
			Cmd:          []string{command},
		},
	)
	util.Raise(err)

	log.Println("ContainerExecAttach......")
	var hijacked_response types.HijackedResponse
	hijacked_response, err = docker_client.ContainerExecAttach(
		context.Background(),
		exec_create_response.ID,
		types_container.ExecAttachOptions{
			Tty: true,
		},
	)
	util.Raise(err)
	defer func() {
		log.Println("hijacked_response closed......")
		hijacked_response.Close()
	}()

	// // ContainerExecAttach and ContainerExecStart have similar functionality
	// //
	// // ContainerExecCreate creates a new exec configuration to run an exec process.
	// // ContainerExecAttach attaches a connection to an exec process in the server.
	// // ContainerExecStart starts an exec process already created in the docker host.
	// //
	// // ContainerExecCreate
	// // resp, err := cli.post(ctx, "/containers/"+containerID+"/exec", nil, options, nil)
	// // ContainerExecAttach
	// // return cli.postHijacked(ctx, "/exec/"+execID+"/start", nil, config, http.Header{...})
	// // ContainerExecStart
	// // resp, err := cli.post(ctx, "/exec/"+execID+"/start", nil, config, nil)
	// log.Println("ContainerExecStart......")
	// err = docker_client.ContainerExecStart(
	// 	context.Background(),
	// 	exec_create_response.ID,
	// 	types_container.ExecStartOptions{
	// 		Tty:    true,
	// 	},
	// )
	// util.Raise(err)

	// docker_stdout/docker_stderr -> websocket
	go func() {
		defer util.Catch()

		defer func() {
			_, _ = hijacked_response.Conn.Write([]byte("\u0004"))
			_ = ws.Close()
			log.Println("stdout/stderr exited......")
		}()

		var err error

		var buf []byte
		buf = make([]byte, 4096)

		for {
			var length int
			length, err = hijacked_response.Reader.Read(buf)
			util.Raise(err)

			// fmt.Print(string(buf[:length]))
			// log.Printf("stdout, %d bytes\n", length)

			err = ws.WriteMessage(websocket.TextMessage, buf[:length])
			util.Raise(err)
		}
	}()

	// websocket -> docker_stdin
	for {
		// log.Println("stdin")

		var message_type int
		var message []byte

		message_type, message, err = ws.ReadMessage()
		if message_type != 1 {
			log.Println("message_type:", message_type)
		}
		if err != nil {
			_, _ = hijacked_response.Conn.Write([]byte("\u0004"))
			_ = ws.Close()
			util.Raise(err)
		}

		var message2 map[string]interface{}
		err = json.Unmarshal(message, &message2)
		if err != nil {
			_, _ = hijacked_response.Conn.Write([]byte("\u0004"))
			_ = ws.Close()
			util.Raise(err)
		}

		var action string
		var data string
		var cols float64
		var rows float64

		action, _ = message2["action"].(string)
		data, _ = message2["data"].(string)
		cols, _ = message2["cols"].(float64)
		rows, _ = message2["rows"].(float64)

		switch action {
		case "stdin":
			_, err = hijacked_response.Conn.Write([]byte(data))
			util.Raise(err)
		case "resize":
			// if resize the tty of an exec process running within a container,
			// use ContainerExecResize instead of ContainerResize
			err = docker_client.ContainerExecResize(
				context.Background(),
				exec_create_response.ID,
				types_container.ResizeOptions{
					Height: uint(rows),
					Width:  uint(cols),
				},
			)
			util.Skip(err)
		default:
			_, _ = hijacked_response.Conn.Write([]byte("\u0004"))
			_ = ws.Close()
			err = fmt.Errorf("unknown message type '%s'", action)
			util.Raise(err)
		}
	}
}

func TestShell(host string, container_id string) error {
	defer util.TimeTaken(time.Now(), "TestShell")

	var err error

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	log.Println("ContainerExecCreate......")
	var exec_create_response types_container.ExecCreateResponse
	exec_create_response, err = docker_client.ContainerExecCreate(
		context.Background(),
		container_id,
		types_container.ExecOptions{
			AttachStdin:  false,
			AttachStdout: true,
			AttachStderr: true,
			Tty:          false,
			Cmd:          []string{"bash", "--version"},
			// Cmd:       []string{"sh", "-c", "bash --version"},
		},
	)
	util.Raise(err)

	var hijacked_response types.HijackedResponse
	hijacked_response, err = docker_client.ContainerExecAttach(
		context.Background(),
		exec_create_response.ID,
		types_container.ExecAttachOptions{
			Tty: false,
		},
	)
	util.Raise(err)
	defer func() {
		log.Println("hijacked_response closed......")
		hijacked_response.Close()
	}()

	// the alternative ways, there are stdcopy.StdCopy() and ContainerExecInspect()
	// note that the stdcopy.StdCopy() treats "executable file not found in $PATH" as stdout
	// when using "sh -c 'xxx'", stderr will be treated as expected
	// OCI runtime exec failed: exec failed: unable to start container process: exec: "bash": executable file not found in $PATH
	var buf bytes.Buffer
	_, err = io.Copy(&buf, hijacked_response.Reader)
	util.Raise(err)
	log.Println(buf.String())
	if strings.Contains(buf.String(), "not found") {
		err = fmt.Errorf("command not found")
		log.Println(err)
	}

	return err
}
