package pod

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"

	"k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/remotecommand"

	k8s_common "lnxterm/module/k8s/common"
	"lnxterm/util"
)

// https://github.com/kubernetes/dashboard/blob/master/modules/api/pkg/handler/terminal.go
// https://github.com/kubernetes/dashboard/blob/master/modules/web/src/shell/component.ts

type PtyHandler interface {
	io.Reader
	io.Writer
	remotecommand.TerminalSizeQueue
}

type TerminalSession struct {
	ws        *websocket.Conn
	size_chan chan remotecommand.TerminalSize
}

func (terminal_session TerminalSession) Next() *remotecommand.TerminalSize {
	var size remotecommand.TerminalSize
	size = <-terminal_session.size_chan
	if size.Height == 0 && size.Width == 0 {
		return nil
	}
	return &size
}

// websocket client <-> websocket server <-> terminal_session.read/write <-> kubernetes apiserver
// websocket client <-- connection1 --> websocket server <-- connection2 --> kubernetes apiserver
//
// TerminalSession.ws.ReadMessage(): websocket: close 1001 (going away)
// client-go: "Unhandled Error" err="websocket: close 1001 (going away)" logger="UnhandledError"
// TerminalSession.ws.ReadMessage(): websocket: close 1005 (no status)
// client-go: "Unhandled Error" err="websocket: close 1005 (no status)" logger="UnhandledError"
func (terminal_session TerminalSession) Read(buffer []byte) (int, error) {
	var err error

	// \u0003: CTRL+C, END_OF_TEXT
	// \u0004: CTRL+D, END_OF_TRANSMISSION
	// \u001b: ESC

	var CTRL_C string
	CTRL_C = "\u0003"

	var CTRL_D string
	CTRL_D = "\u0004"

	// var ESC string
	// ESC = "\u001b"

	// log.Printf("CTRL_C: %x\n", CTRL_C)
	// log.Printf("CTRL_D: %x\n", CTRL_D)
	// log.Printf("ESC: %x\n", ESC)

	defer func() {
		if err != nil {
			log.Println(err)

			// _ = copy(buffer, CTRL_D)

			log.Println("hold the connection......")
			// time.Sleep(500 * time.Millisecond)
			time.Sleep(1 * time.Second)
			// time.Sleep(2 * time.Second)
			log.Println("it's time......")
		}
	}()

	var message_type int
	var message []byte

	message_type, message, err = terminal_session.ws.ReadMessage()
	if message_type != 1 {
		log.Println("message_type:", message_type)
	}
	if err != nil {
		log.Println(err)
		var length int
		length = copy(buffer, CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_C + CTRL_D)
		_ = terminal_session.ws.Close()
		return length, err
	}

	var message2 map[string]interface{}
	err = json.Unmarshal(message, &message2)
	if err != nil {
		log.Println(err)
		var length int
		length = copy(buffer, CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_C + CTRL_D)
		_ = terminal_session.ws.Close()
		return length, err
	}

	var action string
	var data string
	var cols float64
	var rows float64

	action, _ = message2["action"].(string)
	data, _ = message2["data"].(string)
	cols, _ = message2["cols"].(float64)
	rows, _ = message2["rows"].(float64)

	switch action {
	case "stdin":
		// log.Printf("%x\n", data)
		// if data == ESC {
		// 	log.Println("skip......")
		// 	return 0, nil
		// }
		if data == CTRL_C {
			log.Printf("CTRL_C: %x......\n", data)
		}
		var length int
		length = copy(buffer, data)
		return length, nil
	case "resize":
		terminal_session.size_chan <- remotecommand.TerminalSize{Width: uint16(cols), Height: uint16(rows)}
		return 0, nil
	default:
		err = fmt.Errorf("unknown message type '%s'", action)
		log.Println(err)
		var length int
		length = copy(buffer, CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_D)
		// length = copy(buffer, CTRL_C + CTRL_C + CTRL_D)
		_ = terminal_session.ws.Close()
		return length, err
	}
}

func (terminal_session TerminalSession) Write(buffer []byte) (int, error) {
	var err error
	err = terminal_session.ws.WriteMessage(websocket.TextMessage, buffer)
	return len(buffer), err
}

func WsOpenPodTerminal(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

	var err error

	var cluster_id string
	var namespace string
	var pod_name string
	var container_name string
	var command string

	cluster_id = request.FormValue("cluster_id")
	namespace = request.FormValue("namespace")
	pod_name = request.FormValue("pod_name")
	container_name = request.FormValue("container_name")
	command = request.FormValue("command")

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

	var pod map[string]interface{}
	pod = make(map[string]interface{})
	pod = map[string]interface{}{
		"rest_config":    rest_config,
		"namespace":      namespace,
		"pod_name":       pod_name,
		"container_name": container_name,
		"command":        command,
	}

	var upgrader = websocket.Upgrader{}
	upgrader = websocket.Upgrader{
		CheckOrigin: func(request *http.Request) bool { return true },
	}

	var ws *websocket.Conn
	ws, err = upgrader.Upgrade(response, request, nil)
	util.Raise(err)
	defer func() {
		_ = ws.Close()
		log.Println("websocket closed......")
	}()

	var terminal_session TerminalSession
	terminal_session = TerminalSession{
		ws:        ws,
		size_chan: make(chan remotecommand.TerminalSize),
	}
	defer func() {
		close(terminal_session.size_chan)
		log.Println("chan closed......")
	}()

	StartProcess(terminal_session, pod)
}

func StartProcess(pty_handler PtyHandler, pod map[string]interface{}) {
	defer util.TimeTaken(time.Now(), "StartProcess")

	var err error

	var rest_config *rest.Config
	var namespace string
	var pod_name string
	var container_name string
	var command string

	rest_config, _ = pod["rest_config"].(*rest.Config)
	namespace, _ = pod["namespace"].(string)
	pod_name, _ = pod["pod_name"].(string)
	container_name, _ = pod["container_name"].(string)
	command, _ = pod["command"].(string)

	// var rest_config *rest.Config
	// // rest_config, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
	// // rest_config.InsecureSkipTLSVerify = true
	// rest_config, err = clientcmd.RESTConfigFromKubeConfig(kubeconfig)
	// util.Raise(err)
	// rest_config.Timeout = 5 * time.Second

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	// command = "sh"
	if command == "" {
		err = TestShell(rest_config, clientset, pod)
		if err == nil {
			command = "bash"
		} else {
			command = "sh"
		}
	}

	var rest_request *rest.Request
	rest_request = clientset.CoreV1().RESTClient().Post().
		Resource("pods").
		Namespace(namespace).
		Name(pod_name).
		SubResource("exec")
	rest_request.VersionedParams(&v1.PodExecOptions{
		Container: container_name,
		Command:   []string{command},
		Stdin:     true,
		Stdout:    true,
		Stderr:    true,
		TTY:       true,
	}, scheme.ParameterCodec)

	// https://${IP}:${PORT}/api/v1/namespaces/${NAMESPACE}/pods/${POD_NAME}/exec?command=${CMD}&container=${CONTAINER_NAME}&stderr=true&stdin=true&stdout=true&tty=true
	//   wss://${IP}:${PORT}/api/v1/namespaces/${NAMESPACE}/pods/${POD_NAME}/exec?command=${CMD}&container=${CONTAINER_NAME}&stdin=true&stdout=true&stderr=true&tty=true
	log.Println(rest_request.URL())

	var executor remotecommand.Executor
	executor, err = remotecommand.NewSPDYExecutor(rest_config, "POST", rest_request.URL())
	if err != nil {
		log.Println(err)
		_, err = pty_handler.Write([]byte(err.Error()))
		util.Skip(err)
	}

	var ctx context.Context
	var cancel context.CancelFunc

	// ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	// ctx, cancel = context.WithTimeout(context.Background(), 120*time.Second)
	// ctx, cancel = context.WithTimeout(context.Background(), 1*time.Hour)
	ctx, cancel = context.WithTimeout(context.Background(), 12*time.Hour)
	defer func() {
		log.Println("context canceled......")
		cancel()
	}()

	err = executor.StreamWithContext(
		ctx,
		remotecommand.StreamOptions{
			Stdin:             pty_handler,
			Stdout:            pty_handler,
			Stderr:            pty_handler,
			TerminalSizeQueue: pty_handler,
			Tty:               true,
		},
	)
	if err != nil {
		log.Println(err)
		_, err = pty_handler.Write([]byte(err.Error()))
		util.Skip(err)
	}
}

func TestShell(rest_config *rest.Config, clientset *kubernetes.Clientset, pod map[string]interface{}) error {
	defer util.TimeTaken(time.Now(), "TestShell")

	var err error

	var namespace string
	var pod_name string
	var container_name string

	namespace, _ = pod["namespace"].(string)
	pod_name, _ = pod["pod_name"].(string)
	container_name, _ = pod["container_name"].(string)

	var rest_request *rest.Request
	rest_request = clientset.CoreV1().RESTClient().Post().
		Resource("pods").
		Namespace(namespace).
		Name(pod_name).
		SubResource("exec")
	rest_request.VersionedParams(&v1.PodExecOptions{
		Container: container_name,
		Command:   []string{"bash", "--version"},
		Stdin:     false,
		Stdout:    true,
		Stderr:    true,
		TTY:       false,
	}, scheme.ParameterCodec)
	log.Println(rest_request.URL())

	var executor remotecommand.Executor
	executor, err = remotecommand.NewSPDYExecutor(rest_config, "POST", rest_request.URL())
	if err != nil {
		log.Println(err)
		return err
	}

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
		log.Println(err)
	}
	log.Println("stdout:", stdout.String())
	log.Println("stderr:", stderr.String())

	return err
}
