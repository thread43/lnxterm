package container

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types"
	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

func DownloadContainerFile(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var container_id string
	var file string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = strings.TrimSpace(request.FormValue("container_id"))
	file = strings.TrimSpace(request.FormValue("file"))
	log.Println(file)

	if util.IsNotSet(container_id, server_id, file) {
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

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var command []string
	command = []string{"cat", file}
	log.Println(command)

	var exec_create_response types_container.ExecCreateResponse
	exec_create_response, err = docker_client.ContainerExecCreate(
		context.Background(),
		container_id,
		types_container.ExecOptions{
			AttachStdin:  false,
			AttachStdout: true,
			AttachStderr: true,
			Tty:          false,
			Cmd:          command,
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

	var stdout bytes.Buffer
	var stderr bytes.Buffer

	_, err = stdcopy.StdCopy(&stdout, &stderr, hijacked_response.Reader)
	util.Raise(err)

	if len(stderr.Bytes()) > 0 {
		log.Println("stdout length:", len(stdout.Bytes()))
		log.Println("stderr length:", len(stderr.Bytes()))
		err = fmt.Errorf("unexpected data")
		util.Raise(err)
	}

	var filename string
	filename = filepath.Base(file)
	log.Println("attachment; filename=" + strconv.Quote(filename))

	response.Header().Set("Content-Disposition", "attachment; filename="+strconv.Quote(filename))
	response.Header().Set("Content-Type", "application/octet-stream")

	// // use stdcopy.StdCopy instead of io.Copy
	// // docker will add 8-byte header before the payload
	// // the first byte indicates the stream type
	// // the last four bytes represent the payload size
	// // e.g.,
	// //   less file
	// //   ---------
	// //   ^A^@^@^@^@^@^A<EE>...
	// //   ---------
	// //	hexdump -C file
	// //   ---------------
	// //	01 00 00 00 00 00 00 ac...
	// //   ---------------
	// // 	0x01 for stdout, 0x02 for stderr, 0x00 for stdin
	// // 	0xac = 172bytes
	// //   ---------------
	// var buf bytes.Buffer
	// _, err = io.Copy(&buf, hijacked_response.Reader)
	// _, err = io.Copy(response, hijacked_response.Reader)

	_, err = io.Copy(response, &stdout)
	util.Raise(err)
}
