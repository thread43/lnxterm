package pod

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"strconv"
	"strings"

	core_v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetPodLog(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string
	var pod_name string
	var container_name string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))
	pod_name = strings.TrimSpace(request.FormValue("pod_name"))
	container_name = strings.TrimSpace(request.FormValue("container_name"))

	if util.IsNotSet(cluster_id, namespace, pod_name, container_name) {
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

	var rest_request *rest.Request
	rest_request = clientset.CoreV1().Pods(namespace).GetLogs(
		pod_name,
		&core_v1.PodLogOptions{
			Container: container_name,
			TailLines: &[]int64{100}[0],
		},
	)

	var stream io.ReadCloser
	stream, err = rest_request.Stream(context.Background())
	util.Raise(err)
	defer func() {
		_ = stream.Close()
	}()

	var buf *bytes.Buffer
	buf = new(bytes.Buffer)
	_, err = io.Copy(buf, stream)
	util.Raise(err)

	util.Api(response, 200, buf.String())
}
