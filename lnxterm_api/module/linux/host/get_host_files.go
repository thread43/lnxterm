package host

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"

	linux_host_common "lnxterm/module/linux/host/common"
	"lnxterm/util"
)

func GetHostFiles(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

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

	var file_list []os.FileInfo
	file_list, err = sftp_client.ReadDir(dir)
	util.Raise(err)

	var files []map[string]interface{}
	files = make([]map[string]interface{}, 0)

	// type FileInfo interface {
	// 	Name() string       // base name of the file
	// 	Size() int64        // length in bytes for regular files; system-dependent for others
	// 	Mode() FileMode     // file mode bits
	// 	ModTime() time.Time // modification time
	// 	IsDir() bool        // abbreviation for Mode().IsDir()
	// 	Sys() any           // underlying data source (can return nil)
	// }
	var item os.FileInfo
	for _, item = range file_list {
		var name string
		var size int64
		var mode string
		var mod_time string
		var is_dir bool
		var pwd string
		var abs_path string
		var is_link bool
		var is_file bool

		name = item.Name()
		size = item.Size()
		mode = item.Mode().String()
		mod_time = item.ModTime().Format("2006-01-02 15:04:05")
		is_dir = item.IsDir()

		pwd = dir
		if strings.HasSuffix(pwd, "/") {
			abs_path = pwd + name
		} else {
			abs_path = pwd + "/" + name
		}
		if strings.HasPrefix(mode, "L") || strings.HasPrefix(mode, "l") {
			is_link = true
		}
		if strings.HasPrefix(mode, "-") {
			is_file = true
		}

		files = append(
			files,
			map[string]interface{}{
				"name":     name,
				"size":     size,
				"mode":     mode,
				"mod_time": mod_time,
				"is_dir":   is_dir,
				"pwd":      dir,
				"abs_path": abs_path,
				"is_link":  is_link,
				"is_file":  is_file,
			},
		)
	}

	sort.Slice(files, func(i int, j int) bool { return files[i]["name"].(string) < files[j]["name"].(string) })

	util.Api(response, 200, files)
}
