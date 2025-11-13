package common

import (
	"time"

	"k8s.io/apimachinery/pkg/version"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"

	k8s_common "lnxterm/module/k8s/common"
)

func GetVersion(kubeconfig string, server string, token string) (string, error) {
	var err error

	var rest_config *rest.Config

	if kubeconfig != "" {
		var kubeconfig2 []byte
		kubeconfig2, err = k8s_common.ParseKubeconfig(kubeconfig)
		if err != nil {
			return "", err
		}

		rest_config, err = clientcmd.RESTConfigFromKubeConfig(kubeconfig2)
		if err != nil {
			return "", err
		}
	} else {
		rest_config = &rest.Config{
			Host:            server,
			BearerToken:     token,
			TLSClientConfig: rest.TLSClientConfig{Insecure: true},
		}
	}

	rest_config.Timeout = 5 * time.Second

	var discovery_client *discovery.DiscoveryClient
	discovery_client, err = discovery.NewDiscoveryClientForConfig(rest_config)
	if err != nil {
		return "", err
	}

	var version *version.Info
	version, err = discovery_client.ServerVersion()
	if err != nil {
		return "", err
	}

	var version2 string
	version2 = version.String()

	return version2, nil
}
