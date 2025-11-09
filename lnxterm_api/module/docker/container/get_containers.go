package container

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

func GetContainers(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	server_id = strings.TrimSpace(request.FormValue("server_id"))

	if util.IsNotSet(server_id) {
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

	// client.FromEnv
	// - EnvOverrideHost = "DOCKER_HOST"
	// - EnvOverrideAPIVersion = "DOCKER_API_VERSION"
	// - EnvOverrideCertPath = "DOCKER_CERT_PATH"
	// - EnvTLSVerify = "DOCKER_TLS_VERIFY"
	//
	// DOCKER_HOST="tcp://0.0.0.0:2375"
	// DOCKER_HOST="tcp://127.0.0.1:2375"
	var docker_client *client.Client
	// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var container_list []types_container.Summary
	container_list, err = docker_client.ContainerList(context.Background(), types_container.ListOptions{})
	if err != nil {
		log.Println(err)
		// Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
		if strings.Contains(err.Error(), "Cannot connect to the Docker daemon") {
			util.Api(response, 999)
			return
		}
	}
	util.Raise(err)

	var containers []map[string]interface{}
	containers = make([]map[string]interface{}, 0)

	var container types_container.Summary
	for _, container = range container_list {
		var id string
		var container_id string
		var container_id_raw string
		var name string
		var name_raw string
		var image string
		var image_id string
		var command string
		var created time.Time
		var created_raw int64
		var status string
		var state string

		id = container.ID
		container_id = container.ID[0:12]
		container_id_raw = container.ID
		name = strings.Replace(container.Names[0], "/", "", 1)
		name_raw = container.Names[0]
		image = container.Image
		image_id = container.ImageID
		command = container.Command
		created = time.Unix(container.Created, 0)
		created_raw = container.Created
		status = container.Status
		state = container.State

		containers = append(
			containers,
			map[string]interface{}{
				"server_id":        server_id2,
				"id":               id,
				"container_id":     container_id,
				"container_id_raw": container_id_raw,
				"name":             name,
				"name_raw":         name_raw,
				"image":            image,
				"image_id":         image_id,
				"command":          command,
				"created":          created.Format("2006-01-02 15:04:05"),
				"created_raw":      created_raw,
				"status":           status,
				"state":            state,
			},
		)
	}

	util.Api(response, 200, containers)
}
