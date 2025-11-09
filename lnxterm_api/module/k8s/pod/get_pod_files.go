package pod

import (
	"bytes"
	"context"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/remotecommand"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func GetPodFiles(response http.ResponseWriter, request *http.Request) {
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

	var command []string
	// command = []string{"sh", "-c", "ls -lA " + dir}
	command = []string{"ls", "-lA", dir}
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
	util.Raise(err)

	if stderr.String() != "" {
		log.Println("stdout:", stdout.String())
		log.Println("stderr:", stderr.String())
	}

	var stdout_str string
	stdout_str = stdout.String()

	var files []map[string]interface{}
	files = make([]map[string]interface{}, 0)

	var lines []string
	stdout_str = strings.TrimSpace(stdout_str)
	lines = strings.Split(stdout_str, "\n")

	var index int
	var line string

	for index, line = range lines {
		if strings.HasPrefix(line, "total") {
			continue
		}

		var fields []string
		fields = strings.Fields(line)

		if len(fields) < 9 {
			log.Println("unexpected data:", line)
		}

		if len(fields) >= 9 {
			var mode string
			var size string
			var name string
			var pwd string
			var abs_path string
			var is_dir bool
			var is_link bool
			var is_file bool

			mode = fields[0]
			size = fields[4]
			name = strings.Join(fields[8:], " ")

			if strings.HasPrefix(mode, "c") {
				mode = fields[0]
				size = fields[5]
				if len(fields) >= 10 {
					name = strings.Join(fields[9:], " ")
				} else {
					name = "???"
					log.Println("unexpected data:", line)
				}
			}

			pwd = dir
			if strings.HasSuffix(pwd, "/") {
				abs_path = pwd + name
			} else {
				abs_path = pwd + "/" + name
			}

			if strings.HasPrefix(mode, "d") {
				is_dir = true
			}
			if strings.HasPrefix(mode, "-") {
				is_file = true
			}
			if strings.HasPrefix(mode, "L") || strings.HasPrefix(mode, "l") {
				is_link = true
			}

			files = append(
				files,
				map[string]interface{}{
					"id":       index,
					"mode":     mode,
					"size":     size,
					"name":     name,
					"pwd":      dir,
					"abs_path": abs_path,
					"is_dir":   is_dir,
					"is_file":  is_file,
					"is_link":  is_link,
				},
			)
		}
	}

	sort.Slice(files, func(i int, j int) bool { return files[i]["name"].(string) < files[j]["name"].(string) })

	util.Api(response, 200, files)
}
