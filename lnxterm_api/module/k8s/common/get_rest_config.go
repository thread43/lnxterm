package common

import (
	"log"
	"time"

	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func GetRestConfig(cluster_id int64) (*rest.Config, error) {
	var err error

	var rest_config *rest.Config

	var cluster map[string]interface{}
	cluster, err = GetCluster(cluster_id)
	if err != nil {
		return nil, err
	}

	var kubeconfig string
	var server string
	var token string

	kubeconfig, _ = cluster["kubeconfig"].(string)
	server, _ = cluster["server"].(string)
	token, _ = cluster["token"].(string)

	log.Println("kubeconfig:", kubeconfig)
	log.Println("server:", server)

	if kubeconfig != "" {
		var kubeconfig2 []byte
		kubeconfig2, err = ParseKubeconfig(kubeconfig)
		if err != nil {
			return nil, err
		}

		rest_config, err = clientcmd.RESTConfigFromKubeConfig(kubeconfig2)
		if err != nil {
			return nil, err
		}
	} else {
		rest_config = &rest.Config{
			Host:            server,
			BearerToken:     token,
			TLSClientConfig: rest.TLSClientConfig{Insecure: true},
		}
	}

	rest_config.Timeout = 5 * time.Second

	return rest_config, nil
}
