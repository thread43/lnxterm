package pod

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetPods(response http.ResponseWriter, request *http.Request) {
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

	var rest_config *rest.Config
	rest_config, err = k8s_common.GetRestConfig(cluster_id2)
	util.Raise(err)

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var pod_list *core_v1.PodList
	pod_list, err = clientset.CoreV1().Pods(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var pods []map[string]interface{}
	pods = make([]map[string]interface{}, 0)

	var item core_v1.Pod
	for _, item = range pod_list.Items {
		var namespace string
		var name string
		var node_name string
		var host_ip string
		var pod_ip string
		var container_statuses []core_v1.ContainerStatus
		var pod_phase core_v1.PodPhase

		namespace = item.Namespace
		name = item.Name
		node_name = item.Spec.NodeName
		host_ip = item.Status.HostIP
		pod_ip = item.Status.PodIP
		container_statuses = item.Status.ContainerStatuses
		pod_phase = item.Status.Phase // Pending|Running|Succeeded|Failed|Unknown

		var containers []map[string]interface{}
		var container_status core_v1.ContainerStatus
		for _, container_status = range container_statuses {
			containers = append(
				containers,
				map[string]interface{}{
					"name":          container_status.Name,
					"image":         container_status.Image,
					"restart_count": container_status.RestartCount,
				},
			)
		}

		pods = append(
			pods,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"namespace":  namespace,
				"name":       name,
				"node_name":  node_name,
				"host_ip":    host_ip,
				"pod_ip":     pod_ip,
				"containers": containers,
				"pod_phase":  pod_phase,
			},
		)

	}

	util.Api(response, 200, pods)
}
