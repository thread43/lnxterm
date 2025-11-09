package host

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"

	linux_host_common "lnxterm/module/linux/host/common"
	"lnxterm/util"
)

func UploadHostFile(response http.ResponseWriter, request *http.Request) {
	var err error

	var host_id string
	var ssh_host string
	var dir string

	host_id = strings.TrimSpace(request.FormValue("host_id"))
	ssh_host = strings.TrimSpace(request.FormValue("ssh_host"))
	dir = strings.TrimSpace(request.FormValue("dir"))
	log.Println(dir)

	if util.IsNotSet(host_id, ssh_host, dir) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(host_id) {
		util.Api(response, 400)
		return
	}

	// request.Body = http.MaxBytesReader(response, request.Body, 1024*1024*1024)

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

	var file2 string
	file2 = dir + "/" + file_header.Filename

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

	var addr string
	var config *ssh.ClientConfig

	addr, config, err = linux_host_common.GetSshClientConfig(host)
	util.Raise(err)
	log.Println(addr)

	var ssh_client *ssh.Client
	ssh_client, err = ssh.Dial("tcp", addr, config)
	util.Raise(err)
	defer func() {
		_ = ssh_client.Close()
		log.Println("ssh_client closed......")
	}()

	var sftp_client *sftp.Client
	sftp_client, err = sftp.NewClient(ssh_client)
	util.Raise(err)
	defer func() {
		_ = sftp_client.Close()
		log.Println("sftp_client closed......")
	}()

	var remote_file *sftp.File
	remote_file, err = sftp_client.Create(file2)
	util.Raise(err)
	defer func() {
		_ = remote_file.Close()
		log.Println("remote_file closed......")
	}()

	_, err = io.Copy(remote_file, file)
	util.Raise(err)

	util.Api(response, 200, nil)
}
