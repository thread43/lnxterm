package container

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"strconv"
	"strings"

	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

func GetContainerLog(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var container_id string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = strings.TrimSpace(request.FormValue("container_id"))

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

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var container_logs io.ReadCloser
	container_logs, err = docker_client.ContainerLogs(
		context.Background(),
		container_id,
		types_container.LogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Tail:       "100",
			Follow:     false,
		},
	)
	util.Raise(err)

	var buf bytes.Buffer
	_, err = io.Copy(&buf, container_logs)
	util.Raise(err)

	util.Api(response, 200, buf.String())
}
