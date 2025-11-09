package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	auth_dept "lnxterm/module/auth/dept"
	auth_menu "lnxterm/module/auth/menu"
	auth_perm "lnxterm/module/auth/perm"
	auth_role "lnxterm/module/auth/role"
	auth_user "lnxterm/module/auth/user"
	common "lnxterm/module/common"
	docker_common "lnxterm/module/docker/common"
	docker_container "lnxterm/module/docker/container"
	docker_image "lnxterm/module/docker/image"
	docker_server "lnxterm/module/docker/server"
	k8s_cluster "lnxterm/module/k8s/cluster"
	k8s_common "lnxterm/module/k8s/common"
	k8s_deployment "lnxterm/module/k8s/deployment"
	k8s_namespace "lnxterm/module/k8s/namespace"
	k8s_node "lnxterm/module/k8s/node"
	k8s_pod "lnxterm/module/k8s/pod"
	k8s_service "lnxterm/module/k8s/service"
	k8s_statefulset "lnxterm/module/k8s/statefulset"
	linux_host "lnxterm/module/linux/host"
	system_log "lnxterm/module/system/log"
	test "lnxterm/module/test"
	"lnxterm/util"
)

type Route struct {
	path    string
	handler func(http.ResponseWriter, *http.Request)
}

var Routes = []Route{
	{"/api/common/change_password", common.ChangePassword},
	{"/api/common/get_current_user", common.GetCurrentUser},
	{"/api/common/get_menus", common.GetMenus},
	{"/api/common/get_perm_codes", common.GetPermCodes},
	{"/api/common/get_perms", common.GetPerms},
	{"/api/common/login", common.Login},
	{"/api/common/logout", common.Logout},
	{"/api/common/update_profile", common.UpdateProfile},

	{"/api/auth/dept/add_dept", auth_dept.AddDept},
	{"/api/auth/dept/delete_dept", auth_dept.DeleteDept},
	{"/api/auth/dept/get_dept", auth_dept.GetDept},
	{"/api/auth/dept/get_depts", auth_dept.GetDepts},
	{"/api/auth/dept/update_dept", auth_dept.UpdateDept},

	{"/api/auth/user/add_user", auth_user.AddUser},
	{"/api/auth/user/assign_role", auth_user.AssignRole},
	{"/api/auth/user/delete_user", auth_user.DeleteUser},
	{"/api/auth/user/disable_user", auth_user.DisableUser},
	{"/api/auth/user/enable_user", auth_user.EnableUser},
	{"/api/auth/user/get_depts", auth_user.GetDepts},
	{"/api/auth/user/get_perms", auth_user.GetPerms},
	{"/api/auth/user/get_roles", auth_user.GetRoles},
	{"/api/auth/user/get_user", auth_user.GetUser},
	{"/api/auth/user/get_users", auth_user.GetUsers},
	{"/api/auth/user/grant_perm", auth_user.GrantPerm},
	{"/api/auth/user/reset_password", auth_user.ResetPassword},
	{"/api/auth/user/update_user", auth_user.UpdateUser},

	{"/api/auth/role/add_role", auth_role.AddRole},
	{"/api/auth/role/delete_role", auth_role.DeleteRole},
	{"/api/auth/role/get_perms", auth_role.GetPerms},
	{"/api/auth/role/get_role", auth_role.GetRole},
	{"/api/auth/role/get_roles", auth_role.GetRoles},
	{"/api/auth/role/grant_perm", auth_role.GrantPerm},
	{"/api/auth/role/update_role", auth_role.UpdateRole},

	{"/api/auth/perm/add_perm", auth_perm.AddPerm},
	{"/api/auth/perm/delete_perm", auth_perm.DeletePerm},
	{"/api/auth/perm/get_menus", auth_perm.GetMenus},
	{"/api/auth/perm/get_perm", auth_perm.GetPerm},
	{"/api/auth/perm/get_perms", auth_perm.GetPerms},
	{"/api/auth/perm/update_perm", auth_perm.UpdatePerm},

	{"/api/auth/menu/add_menu", auth_menu.AddMenu},
	{"/api/auth/menu/delete_menu", auth_menu.DeleteMenu},
	{"/api/auth/menu/get_menu", auth_menu.GetMenu},
	{"/api/auth/menu/get_menus", auth_menu.GetMenus},
	{"/api/auth/menu/get_parent_menus", auth_menu.GetParentMenus},
	{"/api/auth/menu/sort_menu", auth_menu.SortMenu},
	{"/api/auth/menu/update_menu", auth_menu.UpdateMenu},

	{"/api/system/log/get_log", system_log.GetLog},
	{"/api/system/log/get_logs", system_log.GetLogs},

	{"/api/linux/host/add_host", linux_host.AddHost},
	{"/api/linux/host/delete_host", linux_host.DeleteHost},
	{"/api/linux/host/download_host_file", linux_host.DownloadHostFile},
	{"/api/linux/host/get_host", linux_host.GetHost},
	{"/api/linux/host/get_host_files", linux_host.GetHostFiles},
	{"/api/linux/host/get_hosts", linux_host.GetHosts},
	{"/api/linux/host/update_host", linux_host.UpdateHost},
	{"/api/linux/host/upload_host_file", linux_host.UploadHostFile},
	{"/api/linux/host/ws_open_host_terminal", linux_host.WsOpenHostTerminal},

	{"/api/docker/server/add_server", docker_server.AddServer},
	{"/api/docker/server/delete_server", docker_server.DeleteServer},
	{"/api/docker/server/get_server", docker_server.GetServer},
	{"/api/docker/server/get_servers", docker_server.GetServers},
	{"/api/docker/server/update_server", docker_server.UpdateServer},

	{"/api/docker/image/get_images", docker_image.GetImages},
	{"/api/docker/image/get_servers", docker_common.GetServers},

	{"/api/docker/container/download_container_file", docker_container.DownloadContainerFile},
	{"/api/docker/container/download_container_log", docker_container.DownloadContainerLog},
	{"/api/docker/container/get_container_files", docker_container.GetContainerFiles},
	{"/api/docker/container/get_container_log", docker_container.GetContainerLog},
	{"/api/docker/container/get_containers", docker_container.GetContainers},
	{"/api/docker/container/get_servers", docker_common.GetServers},
	{"/api/docker/container/upload_container_file", docker_container.UploadContainerFile},
	{"/api/docker/container/ws_open_container_terminal", docker_container.WsOpenContainerTerminal},

	{"/api/k8s/cluster/add_cluster", k8s_cluster.AddCluster},
	{"/api/k8s/cluster/delete_cluster", k8s_cluster.DeleteCluster},
	{"/api/k8s/cluster/get_cluster", k8s_cluster.GetCluster},
	{"/api/k8s/cluster/get_clusters", k8s_cluster.GetClusters},
	{"/api/k8s/cluster/get_events", k8s_cluster.GetEvents},
	{"/api/k8s/cluster/update_cluster", k8s_cluster.UpdateCluster},

	{"/api/k8s/namespace/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/namespace/get_namespace_yaml", k8s_namespace.GetNamespaceYaml},
	{"/api/k8s/namespace/get_namespaces", k8s_namespace.GetNamespaces},

	{"/api/k8s/node/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/node/get_node_yaml", k8s_node.GetNodeYaml},
	{"/api/k8s/node/get_nodes", k8s_node.GetNodes},

	{"/api/k8s/deployment/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/deployment/get_deployment_yaml", k8s_deployment.GetDeploymentYaml},
	{"/api/k8s/deployment/get_deployments", k8s_deployment.GetDeployments},
	{"/api/k8s/deployment/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/statefulset/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/statefulset/get_statefulset_yaml", k8s_statefulset.GetStatefulsetYaml},
	{"/api/k8s/statefulset/get_statefulsets", k8s_statefulset.GetStatefulsets},
	{"/api/k8s/statefulset/get_namespaces", k8s_common.GetNamespaces},

	{"/api/k8s/service/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/service/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/service/get_service_yaml", k8s_service.GetServiceYaml},
	{"/api/k8s/service/get_services", k8s_service.GetServices},

	{"/api/k8s/pod/download_pod_file", k8s_pod.DownloadPodFile},
	{"/api/k8s/pod/download_pod_log", k8s_pod.DownloadPodLog},
	{"/api/k8s/pod/get_clusters", k8s_common.GetClusters},
	{"/api/k8s/pod/get_namespaces", k8s_common.GetNamespaces},
	{"/api/k8s/pod/get_pod_files", k8s_pod.GetPodFiles},
	{"/api/k8s/pod/get_pod_log", k8s_pod.GetPodLog},
	{"/api/k8s/pod/get_pod_yaml", k8s_pod.GetPodYaml},
	{"/api/k8s/pod/get_pods", k8s_pod.GetPods},
	{"/api/k8s/pod/upload_pod_file", k8s_pod.UploadPodFile},
	{"/api/k8s/pod/ws_get_pod_log", k8s_pod.WsGetPodLog},
	{"/api/k8s/pod/ws_open_pod_terminal", k8s_pod.WsOpenPodTerminal},

	{"/api/test", test.Test},
}

func main() {
	defer util.Catch()

	defer func() {
		_ = util.DB.Close()
	}()

	var err error

	var host string
	var port int
	var sqlite string
	var mysql string
	var log2 string
	var debug2 bool

	flag.StringVar(&host, "host", "0.0.0.0", "Host (e.g. 0.0.0.0|127.0.0.1)")
	flag.IntVar(&port, "port", 1234, "Port")
	flag.StringVar(&sqlite, "sqlite", "lnxterm.db", "SQLite (e.g. lnxterm.db)")
	flag.StringVar(&mysql, "mysql", "", "MySQL (e.g. root:123456@tcp(127.0.0.1:3306)/lnxterm)")
	flag.StringVar(&log2, "log", "stdout", "Log (e.g. stdout|file)")
	flag.BoolVar(&debug2, "debug", false, "Debug")

	flag.Parse()

	{
		log.SetFlags(log.LstdFlags | log.Lshortfile)
		if log2 == "file" {
			var logfile *os.File
			logfile, err = os.OpenFile("lnxterm.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			util.Raise(err)
			defer func() {
				_ = logfile.Close()
			}()
			log.SetOutput(logfile)
		} else {
			log.SetOutput(os.Stdout)
		}
	}

	log.Printf("host: %v\n", host)
	log.Printf("port: %v\n", port)
	log.Printf("sqlite: %v\n", sqlite)
	log.Printf("mysql: %v\n", mysql)
	log.Printf("log: %v\n", log2)
	log.Printf("debug: %v\n", debug2)

	var address string
	address = fmt.Sprintf("%s:%d", host, port)
	log.Printf("address: %v\n", address)

	if mysql != "" {
		log.Println(mysql)
		util.InitDbWithMysql(mysql)
	} else {
		log.Println(sqlite)
		util.InitDbWithSqlite(sqlite)
	}

	if debug2 {
		util.DEBUG = true
	}

	util.Init()

	http.HandleFunc("/favicon.ico", util.MakeHandler(util.NotFound))

	var route Route
	for _, route = range Routes {
		http.HandleFunc(route.path, util.MakeHandler(route.handler))
	}

	var file_server_handler http.Handler
	file_server_handler = http.FileServer(http.Dir("html"))
	http.Handle("/", util.WrapHandler(file_server_handler))

	// :1234, 0.0.0.0:1234, 127.0.0.1:1234
	fmt.Printf("http://%s/\n", address)
	log.Printf("http://%s/\n", address)
	err = http.ListenAndServe(address, nil)

	log.Fatal(err)
}
