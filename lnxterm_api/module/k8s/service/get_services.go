package service

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetServices(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))

	if util.IsNotSet(cluster_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(cluster_id) {
		util.Api(response, 400)
		return
	}

	var cluster_id2 int64
	cluster_id2, err = strconv.ParseInt(cluster_id, 10, 64)
	util.Raise(err)

	var kubeconfig []byte
	kubeconfig, err = k8s_common.GetKubeconfig(cluster_id2)
	util.Raise(err)

	var rest_config *rest.Config
	rest_config, err = clientcmd.RESTConfigFromKubeConfig(kubeconfig)
	util.Raise(err)
	rest_config.Timeout = 5 * time.Second

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var service_list *core_v1.ServiceList
	service_list, err = clientset.CoreV1().Services(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var services []map[string]interface{}
	services = make([]map[string]interface{}, 0)

	var item core_v1.Service
	for _, item = range service_list.Items {
		var namespace string
		var name string
		var type2 string
		var cluster_ip string
		var ports []map[string]interface{}
		ports = make([]map[string]interface{}, 0)

		namespace = item.Namespace
		name = item.Name
		type2 = string(item.Spec.Type) // ClusterIP|NodePort|LoadBalancer|ExternalName
		cluster_ip = item.Spec.ClusterIP
		var service_port core_v1.ServicePort
		for _, service_port = range item.Spec.Ports {
			ports = append(
				ports,
				map[string]interface{}{
					"name":        service_port.Name,
					"port":        service_port.Port,
					"protocol":    string(service_port.Protocol),
					"target_port": service_port.TargetPort,
					"node_port":   service_port.NodePort,
				},
			)
		}

		services = append(
			services,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"namespace":  namespace,
				"name":       name,
				"type":       type2,
				"cluster_ip": cluster_ip,
				"ports":      ports,
			},
		)
	}

	util.Api(response, 200, services)
}
