package statefulset

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	apps_v1 "k8s.io/api/apps/v1"
	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetStatefulsets(response http.ResponseWriter, request *http.Request) {
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

	var statefulset_list *apps_v1.StatefulSetList
	statefulset_list, err = clientset.AppsV1().StatefulSets(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var statefulsets []map[string]interface{}
	statefulsets = make([]map[string]interface{}, 0)

	var item apps_v1.StatefulSet
	for _, item = range statefulset_list.Items {
		var namespace string
		var name string
		var spec_replicas int32
		var status_replicas int32

		namespace = item.Namespace
		name = item.Name
		spec_replicas = *item.Spec.Replicas
		status_replicas = item.Status.Replicas

		var containers []map[string]string
		containers = make([]map[string]string, 0)

		var container core_v1.Container
		for _, container = range item.Spec.Template.Spec.Containers {
			containers = append(
				containers,
				map[string]string{
					"name":  container.Name,
					"image": container.Image,
				})
		}

		statefulsets = append(
			statefulsets,
			map[string]interface{}{
				"cluster_id":      cluster_id2,
				"namespace":       namespace,
				"name":            name,
				"spec_replicas":   spec_replicas,
				"status_replicas": status_replicas,
				"containers":      containers,
			},
		)
	}

	util.Api(response, 200, statefulsets)
}
