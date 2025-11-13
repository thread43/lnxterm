package common

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/ssh"
)

func GetSshClientConfig(host map[string]interface{}) (string, *ssh.ClientConfig, error) {
	var err error

	var ssh_host string
	var ssh_port int64
	var ssh_user string
	var ssh_password string
	var ssh_private_key string

	ssh_host, _ = host["ssh_host"].(string)
	ssh_port, _ = host["ssh_port"].(int64)
	ssh_user, _ = host["ssh_user"].(string)
	ssh_password, _ = host["ssh_password"].(string)
	ssh_private_key, _ = host["ssh_private_key"].(string)

	log.Printf("ssh %s@%s:%d\n", ssh_user, ssh_host, ssh_port)

	if strings.HasPrefix(ssh_private_key, "~") {
		ssh_private_key = strings.Replace(ssh_private_key, "~", os.Getenv("HOME"), 1)
	}
	log.Println(ssh_private_key)

	var auth []ssh.AuthMethod
	if ssh_private_key != "" {
		log.Println("using key")

		var pem_bytes []byte
		pem_bytes, err = os.ReadFile(ssh_private_key)
		if err != nil {
			return "", nil, err
		}

		var signer ssh.Signer
		signer, err = ssh.ParsePrivateKey(pem_bytes)
		if err != nil {
			return "", nil, err
		}

		auth = []ssh.AuthMethod{ssh.PublicKeys(signer)}
	} else {
		log.Println("using password")
		auth = []ssh.AuthMethod{ssh.Password(ssh_password)}
	}

	// ":22" = "127.0.0.1:22"
	// "[]:22" = "127.0.0.1:22"
	var addr string
	addr = fmt.Sprintf("%s:%d", ssh_host, ssh_port)

	var config *ssh.ClientConfig
	config = &ssh.ClientConfig{
		User:            ssh_user,
		Auth:            auth,
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         5 * time.Second,
	}

	return addr, config, nil
}
