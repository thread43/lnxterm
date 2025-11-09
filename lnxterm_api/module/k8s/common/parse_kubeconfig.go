package common

import (
	"os"
	"regexp"
	"strings"
)

func ParseKubeconfig(kubeconfig string) ([]byte, error) {
	var err error

	if strings.HasPrefix(kubeconfig, "~") {
		kubeconfig = strings.Replace(kubeconfig, "~", os.Getenv("HOME"), 1)
	}

	var kubeconfig2 []byte
	kubeconfig2, err = os.ReadFile(kubeconfig)
	if err != nil {
		return nil, err
	}

	var re *regexp.Regexp
	var kubeconfig3 string

	re = regexp.MustCompile(`certificate-authority-data: .*`)
	kubeconfig3 = re.ReplaceAllString(string(kubeconfig2), "insecure-skip-tls-verify: true")

	return []byte(kubeconfig3), nil
}
