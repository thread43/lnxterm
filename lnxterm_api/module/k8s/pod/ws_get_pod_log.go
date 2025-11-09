package pod

import (
	"context"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"

	core_v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

func WsGetPodLog(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string
	var name string
	var container_name string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))
	name = strings.TrimSpace(request.FormValue("name"))
	container_name = strings.TrimSpace(request.FormValue("container_name"))

	if util.IsNotSet(cluster_id, namespace, name, container_name) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(cluster_id) {
		util.Api(response, 400)
		return
	}

	var upgrader = websocket.Upgrader{}
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(request *http.Request) bool { return true },
	}

	var ws *websocket.Conn
	ws, err = upgrader.Upgrade(response, request, nil)
	util.Raise(err)
	defer func() {
		_ = ws.Close()
		log.Println("websocket closed......")
	}()

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

	var rest_request *rest.Request
	rest_request = clientset.CoreV1().Pods(namespace).GetLogs(
		name,
		&core_v1.PodLogOptions{
			Container: container_name,
			TailLines: &[]int64{100}[0],
			Follow:    true,
		},
	)

	var stream io.ReadCloser
	stream, err = rest_request.Stream(context.Background())
	util.Raise(err)
	defer func() {
		_ = stream.Close()
	}()

	go func() {
		defer util.Catch()

		defer func() {
			_ = ws.Close()
			log.Println("stdout exited......")
		}()

		var err error

		for {
			var buf []byte
			buf = make([]byte, 4096)

			var length int
			length, err = stream.Read(buf)
			util.Raise(err)

			// fmt.Print(string(buf[:length]))
			// log.Printf("stdout, %d bytes\n", length)

			err = ws.WriteMessage(websocket.TextMessage, buf[:length])
			util.Raise(err)
		}
	}()

	for {
		var err error
		_, _, err = ws.ReadMessage()
		if err != nil {
			log.Println(err)
			_ = ws.Close()
			log.Println("websocket closed......")
			break
		}
		log.Println("blocking read")
	}
}
