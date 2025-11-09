package container

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types"
	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

func GetContainerFiles(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var container_id string
	var dir string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = strings.TrimSpace(request.FormValue("container_id"))
	dir = strings.TrimSpace(request.FormValue("dir"))
	log.Println(dir)

	if util.IsNotSet(server_id, container_id, dir) {
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
	command = []string{"ls", "-lA", dir}
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

	var stdout2 string
	stdout2 = stdout.String()

	var lines []string
	stdout2 = strings.TrimSpace(stdout2)
	lines = strings.Split(stdout2, "\n")

	var files []map[string]interface{}
	files = make([]map[string]interface{}, 0)

	var index int
	var line string

	for index, line = range lines {
		if strings.HasPrefix(line, "total") {
			continue
		}

		var fields []string
		fields = strings.Fields(line)

		if len(fields) < 9 {
			log.Println("unexpected data:", line)
		}

		if len(fields) >= 9 {
			var mode string
			var size string
			var name string
			var pwd string
			var abs_path string
			var is_dir bool
			var is_link bool
			var is_file bool

			mode = fields[0]
			size = fields[4]
			name = strings.Join(fields[8:], " ")

			if strings.HasPrefix(mode, "c") {
				mode = fields[0]
				size = fields[5]
				if len(fields) >= 10 {
					name = strings.Join(fields[9:], " ")
				} else {
					name = "???"
					log.Println("unexpected data:", line)
				}
			}

			pwd = dir
			if strings.HasSuffix(pwd, "/") {
				abs_path = pwd + name
			} else {
				abs_path = pwd + "/" + name
			}

			if strings.HasPrefix(mode, "d") {
				is_dir = true
			}
			if strings.HasPrefix(mode, "-") {
				is_file = true
			}
			if strings.HasPrefix(mode, "L") || strings.HasPrefix(mode, "l") {
				is_link = true
			}

			files = append(
				files,
				map[string]interface{}{
					"id":       index,
					"mode":     mode,
					"size":     size,
					"name":     name,
					"pwd":      dir,
					"abs_path": abs_path,
					"is_dir":   is_dir,
					"is_file":  is_file,
					"is_link":  is_link,
				},
			)
		}
	}

	sort.Slice(files, func(i int, j int) bool { return files[i]["name"].(string) < files[j]["name"].(string) })

	util.Api(response, 200, files)
}
