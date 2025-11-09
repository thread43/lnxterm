package common

import (
	"bufio"
	"os"
	"strings"
)

func ParseServer(kubeconfig string) (string, error) {
	var err error

	if strings.HasPrefix(kubeconfig, "~") {
		kubeconfig = strings.Replace(kubeconfig, "~", os.Getenv("HOME"), 1)
	}

	var file *os.File
	file, err = os.Open(kubeconfig)
	if err != nil {
		return "", err
	}
	defer func() {
		_ = file.Close()
	}()

	var scanner *bufio.Scanner
	scanner = bufio.NewScanner(file)

	var server string
	var line string

	for scanner.Scan() {
		line = strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "server: ") {
			var fields []string
			fields = strings.SplitN(line, ":", 2)
			server = strings.TrimSpace(fields[1])
			break
		}
	}
	err = scanner.Err()
	if err != nil {
		return "", err
	}

	return server, nil
}
