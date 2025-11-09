package host

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"

	linux_host_common "lnxterm/module/linux/host/common"
	"lnxterm/util"
)

func DownloadHostFile(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

	var err error

	var host_id string
	var ssh_host string
	var file string

	host_id = strings.TrimSpace(request.FormValue("host_id"))
	ssh_host = strings.TrimSpace(request.FormValue("ssh_host"))
	file = strings.TrimSpace(request.FormValue("file"))
	log.Println(file)

	if util.IsNotSet(host_id, ssh_host, file) {
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
	remote_file, err = sftp_client.Open(file)
	util.Raise(err)
	defer func() {
		_ = remote_file.Close()
		log.Println("remote_file closed......")
	}()

	var filename string
	filename = filepath.Base(file)
	log.Println("attachment; filename=" + strconv.Quote(filename))

	response.Header().Set("Content-Disposition", "attachment; filename="+strconv.Quote(filename))
	response.Header().Set("Content-Type", "application/octet-stream")

	_, err = io.Copy(response, remote_file)
	util.Raise(err)
}
