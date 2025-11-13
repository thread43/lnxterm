package cluster

import (
	"net/http"
	"strings"

	k8s_cluster_common "lnxterm/module/k8s/cluster/common"
	"lnxterm/util"
)

func UpdateCluster(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var kubeconfig string
	var server string
	var token string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	kubeconfig = strings.TrimSpace(request.FormValue("kubeconfig"))
	server = strings.TrimSpace(request.FormValue("server"))
	token = strings.TrimSpace(request.FormValue("token"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(id, name) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotSet(kubeconfig) {
		if util.IsNotSet(server, token) {
			util.Api(response, 400)
			return
		}
	}

	if kubeconfig != "" {
		server, err = k8s_cluster_common.ParseServer(kubeconfig)
		util.Raise(err)
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE k8s_cluster SET name=?, kubeconfig=?, server=?, token=?, remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name, kubeconfig, server, token, remark, update_time,
			id,
		)
		util.Raise(err)
	}

	go func() {
		defer util.Catch()

		var version string
		version, err = k8s_cluster_common.GetVersion(kubeconfig, server, token)
		util.Skip(err)

		var query string
		query = "UPDATE k8s_cluster SET version=? WHERE id=?"
		_, err = util.DB.Exec(query, version, id)
		util.Skip(err)
	}()

	util.Api(response, 200)
}
