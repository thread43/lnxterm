package namespace

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

func GetNodes(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))

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

	var node_list *core_v1.NodeList
	node_list, err = clientset.CoreV1().Nodes().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var nodes []map[string]interface{}
	nodes = make([]map[string]interface{}, 0)

	var item core_v1.Node
	for _, item = range node_list.Items {
		var name string
		var ip string
		var hostname string
		var os string
		var os_image string
		var arch string
		var kernel string
		var cpu string
		var memory string
		var storage string
		var runtime string
		var status string

		name = item.Name
		os = item.Status.NodeInfo.OperatingSystem
		os_image = item.Status.NodeInfo.OSImage
		arch = item.Status.NodeInfo.Architecture
		kernel = item.Status.NodeInfo.KernelVersion
		cpu = item.Status.Capacity.Cpu().String()
		memory = item.Status.Capacity.Memory().String()
		storage = item.Status.Capacity.StorageEphemeral().String()
		runtime = item.Status.NodeInfo.ContainerRuntimeVersion

		// NodeHostName NodeAddressType = "Hostname"
		// NodeInternalIP NodeAddressType = "InternalIP"
		// NodeExternalIP NodeAddressType = "ExternalIP"
		// NodeInternalDNS NodeAddressType = "InternalDNS"
		// NodeExternalDNS NodeAddressType = "ExternalDNS"
		var address core_v1.NodeAddress
		for _, address = range item.Status.Addresses {
			if address.Type == core_v1.NodeInternalIP {
				ip = address.Address
			}
			if address.Type == core_v1.NodeHostName {
				hostname = address.Address
			}
		}

		// NodeReady NodeConditionType = "Ready"
		// NodeMemoryPressure NodeConditionType = "MemoryPressure"
		// NodeDiskPressure NodeConditionType = "DiskPressure"
		// NodePIDPressure NodeConditionType = "PIDPressure"
		// NodeNetworkUnavailable NodeConditionType = "NetworkUnavailable"
		var condition core_v1.NodeCondition
		for _, condition = range item.Status.Conditions {
			if condition.Status == core_v1.ConditionTrue {
				status = string(condition.Type)
			}
		}

		nodes = append(
			nodes,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"name":       name,
				"ip":         ip,
				"hostname":   hostname,
				"os":         os,
				"os_image":   os_image,
				"arch":       arch,
				"kernel":     kernel,
				"cpu":        cpu,
				"memory":     memory,
				"storage":    storage,
				"runtime":    runtime,
				"status":     status,
			},
		)
	}

	util.Api(response, 200, nodes)
}
