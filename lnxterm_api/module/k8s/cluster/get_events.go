package cluster

import (
	"context"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetEvents(response http.ResponseWriter, request *http.Request) {
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

	var rest_config *rest.Config
	rest_config, err = k8s_common.GetRestConfig(cluster_id2)
	util.Raise(err)

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var event_list *core_v1.EventList
	event_list, err = clientset.CoreV1().Events("").List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	sort.Slice(
		event_list.Items,
		func(i int, j int) bool {
			return event_list.Items[j].CreationTimestamp.Before(&event_list.Items[i].CreationTimestamp)
		},
	)

	var events []map[string]interface{}
	events = make([]map[string]interface{}, 0)

	var item core_v1.Event
	for _, item = range event_list.Items {
		var name string
		var namespace string
		var time2 string
		var type2 string
		var reason string
		var object string
		var message string

		name = item.Name
		namespace = item.Namespace
		time2 = item.CreationTimestamp.Format("2006-01-02 15:04:05")
		type2 = item.Type // Normal|Warning
		reason = item.Reason
		object = fmt.Sprintf("%s/%s", item.InvolvedObject.Kind, item.InvolvedObject.Name)
		message = item.Message

		events = append(
			events,
			map[string]interface{}{
				"name":      name,
				"namespace": namespace,
				"time":      time2,
				"type":      type2,
				"reason":    reason,
				"object":    object,
				"message":   message,
			},
		)
	}

	util.Api(response, 200, events)
}
