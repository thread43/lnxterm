package cluster

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	k8s_cluster_common "lnxterm/module/k8s/cluster/common"
	"lnxterm/util"
)

func AddCluster(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var kubeconfig string
	var server string
	var token string
	var remark string

	name = strings.TrimSpace(request.FormValue("name"))
	kubeconfig = strings.TrimSpace(request.FormValue("kubeconfig"))
	server = strings.TrimSpace(request.FormValue("server"))
	token = strings.TrimSpace(request.FormValue("token"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(name) {
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

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	var last_insert_id int64

	{
		var query string
		var result sql.Result

		query = `
			INSERT INTO k8s_cluster (name, kubeconfig, server, token, remark, create_time, update_time)
			VALUES (?,?,?,?,?,?,?)
		`
		result, err = util.DB.Exec(
			query,
			name, kubeconfig, server, token, remark, create_time, update_time,
		)
		if err != nil {
			log.Println(err)
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				util.Api(response, 409)
				return
			}
			if strings.Contains(err.Error(), "Error 1062 (23000): Duplicate entry") {
				util.Api(response, 409)
				return
			}
		}
		util.Raise(err)

		last_insert_id, err = result.LastInsertId()
		util.Skip(err)
	}

	go func() {
		defer util.Catch()

		var version string
		version, err = k8s_cluster_common.GetVersion(kubeconfig, server, token)
		util.Skip(err)

		var query string
		query = "UPDATE k8s_cluster SET version=? WHERE id=?"
		_, err = util.DB.Exec(query, version, last_insert_id)
		util.Skip(err)
	}()

	util.Api(response, 200)
}
