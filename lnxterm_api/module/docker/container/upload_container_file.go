package container

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	docker_common "lnxterm/module/docker/common"
	"lnxterm/util"
)

// compared to UploadContainerFileAlt(), CopyToContainer() is the recommended way
func UploadContainerFile(response http.ResponseWriter, request *http.Request) {
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

	err = request.ParseMultipartForm(64 << 20)
	util.Raise(err)

	var file multipart.File
	var file_header *multipart.FileHeader

	file, file_header, err = request.FormFile("file")
	util.Raise(err)
	defer func() {
		_ = file.Close()
		log.Println("file closed......")
	}()

	log.Println("uploaded file name:", file_header.Filename)
	log.Println("uploaded file size:", file_header.Size)
	log.Println("uploaded file header:", file_header.Header)

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var buf bytes.Buffer
	_, err = io.Copy(&buf, file)
	util.Raise(err)

	if int64(len(buf.Bytes())) != file_header.Size {
		log.Println("size before:", file_header.Size)
		log.Println("size after:", len(buf.Bytes()))
		err = fmt.Errorf("file size unmatched")
		util.Raise(err)
	}

	// buf -> buf2
	var buf2 bytes.Buffer

	{
		var tar_writer *tar.Writer
		tar_writer = tar.NewWriter(&buf2)

		var tar_header *tar.Header
		tar_header = &tar.Header{
			Name: file_header.Filename,
			Size: file_header.Size,
			Mode: 0644,
		}

		err = tar_writer.WriteHeader(tar_header)
		util.Raise(err)

		_, err = tar_writer.Write(buf.Bytes())
		util.Raise(err)

		err = tar_writer.Close()
		util.Raise(err)
	}

	err = docker_client.CopyToContainer(
		context.Background(),
		container_id,
		dir,
		&buf2,
		types_container.CopyToContainerOptions{},
	)
	util.Raise(err)

	util.Api(response, 200, nil)
}
