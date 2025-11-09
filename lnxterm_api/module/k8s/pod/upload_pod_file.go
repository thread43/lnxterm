package pod

import (
	"bytes"
	"context"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/remotecommand"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func UploadPodFile(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string
	var pod_name string
	var container_name string
	var dir string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))
	pod_name = strings.TrimSpace(request.FormValue("pod_name"))
	container_name = strings.TrimSpace(request.FormValue("container_name"))
	dir = strings.TrimSpace(request.FormValue("dir"))
	log.Println(dir)

	if util.IsNotSet(cluster_id, namespace, pod_name, container_name, dir) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(cluster_id) {
		util.Api(response, 400)
		return
	}

	err = request.ParseMultipartForm(64 << 20)
	util.Raise(err)

	var file multipart.File
	var file_header *multipart.FileHeader

	file, file_header, err = request.FormFile("file")
	util.Raise(err)
	defer func() {
		_ = file.Close()
		log.Println("file closed......")
	}()

	log.Println("uploaded file name:", file_header.Filename)
	log.Println("uploaded file size:", file_header.Size)
	log.Println("uploaded file header:", file_header.Header)

	var file2 string
	file2 = filepath.Join(dir, file_header.Filename)
	log.Println(file2)

	var cluster_id2 int64
	cluster_id2, err = strconv.ParseInt(cluster_id, 10, 64)
	util.Raise(err)

	var kubeconfig []byte
	kubeconfig, err = k8s_common.GetKubeconfig(cluster_id2)
	util.Raise(err)

	var rest_config *rest.Config
	rest_config, err = clientcmd.RESTConfigFromKubeConfig(kubeconfig)
	util.Raise(err)
	// rest_config.Timeout = 5 * time.Second

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	// // not working (">" is shell builtin feature)
	// // cat: can't open '>': No such file or directory
	// command = []string{"cat", ">", file2}
	//
	// // not working (">" is shell builtin feature)
	// // exec: "cat >": executable file not found in $PATH: unknown
	// command = []string{"cat >", file2}
	//
	// // working not very well, has a limitation of upload size 32768 (32mb)
	// // "Unhandled Error" err="write tcp xxx: use of closed network connection" logger="UnhandledError"
	// file2 = strconv.Quote(file2)
	// command = []string{"sh", "-c", "cat > " + file2}
	var command []string
	command = []string{"cp", "/dev/stdin", file2}
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
		Stdin:     true,
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
			Stdin:  file,
			Stdout: &stdout,
			Stderr: &stderr,
			Tty:    false,
		},
	)
	if err != nil {
		log.Println("stderr:", stderr.String())
		util.Raise(err)
	}

	util.Api(response, 200, nil)
}
