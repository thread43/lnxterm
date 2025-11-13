package cluster

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetCluster(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = strings.TrimSpace(request.FormValue("id"))

	if util.IsNotSet(id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var cluster map[string]interface{}
	cluster = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, name, kubeconfig, server, token, version,
				remark, create_time, update_time
			FROM k8s_cluster
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var name sql.NullString
		var kubeconfig sql.NullString
		var server sql.NullString
		var token sql.NullString
		var version sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(
			&id, &name, &kubeconfig, &server, &token, &version,
			&remark, &create_time, &update_time,
		)
		util.Raise(err)

		cluster = map[string]interface{}{
			"id":          id.Int64,
			"name":        name.String,
			"kubeconfig":  kubeconfig.String,
			"server":      server.String,
			"token":       token.String,
			"version":     version.String,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, cluster)
}
