package pod

import (
	"bytes"
	"context"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/remotecommand"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func DownloadPodFile(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string
	var pod_name string
	var container_name string
	var file string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))
	pod_name = strings.TrimSpace(request.FormValue("pod_name"))
	container_name = strings.TrimSpace(request.FormValue("container_name"))
	file = strings.TrimSpace(request.FormValue("file"))
	log.Println(file)

	if util.IsNotSet(cluster_id, namespace, pod_name, container_name, file) {
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
	// rest_config.Timeout = 5 * time.Second

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var command []string
	command = []string{"cat", file}
	log.Println(command)

	var rest_request *rest.Request
	rest_request = clientset.CoreV1().RESTClient().Post().
		Resource("pods").
		Namespace(namespace).
		Name(pod_name).
		SubResource("exec")
	rest_request.VersionedParams(&v1.PodExecOptions{
		Container: container_name,
		Command:   command,
		Stdin:     false,
		Stdout:    true,
		Stderr:    true,
		TTY:       false,
	}, scheme.ParameterCodec)
	log.Println(rest_request.URL())

	var executor remotecommand.Executor
	executor, err = remotecommand.NewSPDYExecutor(rest_config, "POST", rest_request.URL())
	util.Raise(err)

	var stdout bytes.Buffer
	var stderr bytes.Buffer

	err = executor.StreamWithContext(
		context.Background(),
		remotecommand.StreamOptions{
			Stdin:  nil,
			Stdout: &stdout,
			Stderr: &stderr,
			Tty:    false,
		},
	)
	if err != nil {
		log.Println("stderr:", stderr.String())
		util.Raise(err)
	}

	var filename string
	filename = filepath.Base(file)
	log.Println("attachment; filename=" + strconv.Quote(filename))

	response.Header().Set("Content-Disposition", "attachment; filename="+strconv.Quote(filename))
	response.Header().Set("Content-Type", "application/octet-stream")

	_, err = io.Copy(response, &stdout)
	util.Raise(err)
}
