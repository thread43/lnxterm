package image

import (
	"context"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	types_image "github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

// DOCKER_HOST="unix:///var/run/docker.sock" ./lnxterm
// DOCKER_HOST="tcp://127.0.0.1:2375" ./lnxterm
// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
func GetImages(response http.ResponseWriter, request *http.Request) {
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

	var docker_client *client.Client
	// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var image_list []types_image.Summary
	image_list, err = docker_client.ImageList(context.Background(), types_image.ListOptions{})
	if err != nil {
		log.Println(err)
		// Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
		if strings.Contains(err.Error(), "Cannot connect to the Docker daemon") {
			util.Api(response, 999)
			return
		}
	}
	util.Raise(err)

	var images []map[string]interface{}
	images = make([]map[string]interface{}, 0)

	var image types_image.Summary
	for _, image = range image_list {
		var image_id string
		var image_id_raw string
		var repository string
		var tag string
		var size int64

		image_id = strings.Split(image.ID, ":")[1][0:12]
		image_id_raw = image.ID
		repository = strings.Split(image.RepoTags[0], ":")[0]
		tag = strings.Split(image.RepoTags[0], ":")[1]
		size = image.Size

		images = append(
			images,
			map[string]interface{}{
				"image_id":     image_id,
				"image_id_raw": image_id_raw,
				"repository":   repository,
				"tag":          tag,
				"size":         size,
			},
		)
	}

	sort.Slice(images, func(i int, j int) bool { return images[i]["repository"].(string) < images[j]["repository"].(string) })

	util.Api(response, 200, images)
}
