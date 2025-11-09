package host

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"

	linux_host_common "lnxterm/module/linux/host/common"
	"lnxterm/util"
)

func WsOpenHostTerminal(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

	var err error

	var host_id string
	var ssh_host string

	host_id = strings.TrimSpace(request.FormValue("host_id"))
	ssh_host = strings.TrimSpace(request.FormValue("ssh_host"))

	if util.IsNotSet(host_id, ssh_host) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(host_id) {
		util.Api(response, 400)
		return
	}

	var host_id2 int64
	host_id2, err = strconv.ParseInt(host_id, 10, 64)
	util.Raise(err)

	var host map[string]interface{}
	host, err = linux_host_common.GetHost(host_id2)
	util.Raise(err)

	var ssh_host2 string
	ssh_host2, _ = host["ssh_host"].(string)
	if ssh_host != ssh_host2 {
		err = fmt.Errorf("ssh_host unmatched")
		util.Raise(err)
	}

	var upgrader = websocket.Upgrader{}
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(request *http.Request) bool { return true },
	}

	var ws *websocket.Conn
	ws, err = upgrader.Upgrade(response, request, nil)
	util.Raise(err)
	defer func() {
		_ = ws.Close()
		log.Println("websocket closed......")
	}()

	StartProcess(ws, host)
}

// https://pkg.go.dev/github.com/gorilla/websocket
// https://pkg.go.dev/golang.org/x/crypto/ssh#Session.RequestPty
// https://datatracker.ietf.org/doc/html/rfc4254#section-6
func StartProcess(ws *websocket.Conn, host map[string]interface{}) {
	var err error

	var addr string
	var config *ssh.ClientConfig

	addr, config, err = linux_host_common.GetSshClientConfig(host)
	util.Raise(err)
	log.Println(addr)

	var ssh_client *ssh.Client
	ssh_client, err = ssh.Dial("tcp", addr, config)
	if err != nil {
		_ = ws.WriteMessage(websocket.TextMessage, []byte(err.Error()))
		util.Raise(err)
	}
	defer func() {
		_ = ssh_client.Close()
		log.Println("ssh_client closed......")
	}()

	// 6.1.  Opening a Session
	// https://datatracker.ietf.org/doc/html/rfc4254#section-6.1
	// ch, in, err := c.OpenChannel("session", nil)
	var ssh_session *ssh.Session
	ssh_session, err = ssh_client.NewSession()
	if err != nil {
		_ = ws.WriteMessage(websocket.TextMessage, []byte(err.Error()))
		util.Raise(err)
	}
	defer func() {
		_ = ssh_session.Close()
		log.Println("ssh_session closed......")
	}()

	var ssh_stdin io.WriteCloser
	ssh_stdin, err = ssh_session.StdinPipe()
	util.Raise(err)
	defer func() {
		_ = ssh_stdin.Close()
		log.Println("ssh_stdin closed......")
	}()

	var ssh_stdout io.Reader
	ssh_stdout, err = ssh_session.StdoutPipe()
	util.Raise(err)

	var ssh_stderr io.Reader
	ssh_stderr, err = ssh_session.StderrPipe()
	util.Raise(err)

	var modes ssh.TerminalModes
	modes = ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}

	// 6.2.  Requesting a Pseudo-Terminal
	// https://datatracker.ietf.org/doc/html/rfc4254#section-6.2
	// ok, err := s.ch.SendRequest("pty-req", true, Marshal(&req))
	err = ssh_session.RequestPty("xterm", 40, 80, modes)
	util.Raise(err)

	// 6.5.  Starting a Shell or a Command
	// https://datatracker.ietf.org/doc/html/rfc4254#section-6.5
	// ok, err := s.ch.SendRequest("shell", true, nil)
	err = ssh_session.Shell()
	util.Raise(err)

	// ssh_stdout -> websocket
	go func() {
		defer util.Catch()

		defer func() {
			log.Println("ssh_stdout exited......")
		}()

		var err error

		var buf []byte
		buf = make([]byte, 4096)

		for {
			var length int
			length, err = ssh_stdout.Read(buf)
			util.Raise(err)

			// fmt.Print(string(buf[:length]))
			// log.Printf("stdout, %d bytes\n", length)

			err = ws.WriteMessage(websocket.TextMessage, buf[:length])
			util.Raise(err)
		}
	}()

	// ssh_stderr -> websocket
	go func() {
		defer util.Catch()

		defer func() {
			log.Println("ssh_stderr exited......")
		}()

		var err error

		var buf []byte
		buf = make([]byte, 4096)

		for {
			var length int
			length, err = ssh_stderr.Read(buf)
			util.Raise(err)

			// fmt.Print(string(buf[:length]))
			// log.Printf("stderr, %d bytes\n", length)

			err = ws.WriteMessage(websocket.TextMessage, buf[:length])
			util.Raise(err)
		}
	}()

	// websocket -> ssh_stdin
	for {
		// log.Println("stdin")

		var message_type int
		var message []byte

		message_type, message, err = ws.ReadMessage()
		if message_type != 1 {
			log.Println("message_type:", message_type)
		}
		if err != nil {
			_ = ws.Close()
			util.Raise(err)
		}

		var message2 map[string]interface{}
		err = json.Unmarshal(message, &message2)
		if err != nil {
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
			_, err = ssh_stdin.Write([]byte(data))
			util.Raise(err)
		case "resize":
			// 6.7.  Window Dimension Change Message
			// https://datatracker.ietf.org/doc/html/rfc4254#section-6.7
			// _, err := s.ch.SendRequest("window-change", false, Marshal(&req))
			err = ssh_session.WindowChange(int(rows), int(cols))
			util.Skip(err)
		default:
			_ = ws.Close()
			err = fmt.Errorf("unknown message type '%s'", action)
			util.Raise(err)
		}
	}
}
