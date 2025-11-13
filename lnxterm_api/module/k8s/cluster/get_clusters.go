package cluster

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetClusters(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = `
		SELECT
			id, name, kubeconfig, server, token, version,
			remark, create_time, update_time
		FROM k8s_cluster
		ORDER BY name
	`

	var clusters []map[string]interface{}
	clusters = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString
			var kubeconfig sql.NullString
			var server sql.NullString
			var token sql.NullString
			var version sql.NullString
			var remark sql.NullString
			var create_time sql.NullString
			var update_time sql.NullString

			err = rows.Scan(
				&id, &name, &kubeconfig, &server, &token, &version,
				&remark, &create_time, &update_time,
			)
			util.Raise(err)

			clusters = append(
				clusters,
				map[string]interface{}{
					"id":          id.Int64,
					"name":        name.String,
					"kubeconfig":  kubeconfig.String,
					"server":      server.String,
					"token":       token.String,
					"version":     version.String,
					"remark":      remark.String,
					"create_time": create_time.String,
					"update_time": update_time.String,
				},
			)
		}
	}

	util.Api(response, 200, clusters)
}
