package common

import (
	"embed"
	"encoding/json"
	"io"
	"io/fs"
	"log"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

var (
	//go:embed get_host_info.py
	EMBEDDED_FILES embed.FS
)

func GetHostInfo(id int64) (map[string]interface{}, error) {
	var err error

	var host map[string]interface{}
	host, err = GetHost(id)
	if err != nil {
		return nil, err
	}

	var addr string
	var config *ssh.ClientConfig

	addr, config, err = GetSshClientConfig(host)
	if err != nil {
		return nil, err
	}
	log.Println(addr)

	var ssh_client *ssh.Client
	ssh_client, err = ssh.Dial("tcp", addr, config)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = ssh_client.Close()
	}()

	var sftp_client *sftp.Client
	sftp_client, err = sftp.NewClient(ssh_client)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = sftp_client.Close()
	}()

	// var local_file *os.File
	// local_file, err = os.Open("get_host_info.py")

	var local_file fs.File
	local_file, err = EMBEDDED_FILES.Open("get_host_info.py")
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = local_file.Close()
	}()

	var remote_file *sftp.File
	remote_file, err = sftp_client.Create("/tmp/.get_host_info.py")
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = remote_file.Close()
	}()

	_, err = io.Copy(remote_file, local_file)
	if err != nil {
		return nil, err
	}

	var command string
	command = "python /tmp/.get_host_info.py"

	var ssh_session *ssh.Session
	ssh_session, err = ssh_client.NewSession()
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = ssh_session.Close()
	}()

	var output []byte
	output, err = ssh_session.CombinedOutput("which python")
	log.Println(string(output))
	if err != nil {
		log.Println(err)
		command = "python3 /tmp/.get_host_info.py"
	}

	var ssh_session2 *ssh.Session
	ssh_session2, err = ssh_client.NewSession()
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = ssh_session2.Close()
	}()

	var output2 []byte
	output2, err = ssh_session2.CombinedOutput(command)
	log.Println(string(output2))
	if err != nil {
		return nil, err
	}

	var output3 map[string]interface{}
	err = json.Unmarshal(output2, &output3)
	if err != nil {
		return nil, err
	}
	log.Println(output3)

	return output3, nil
}
