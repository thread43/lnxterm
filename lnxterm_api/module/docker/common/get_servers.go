package common

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetServers(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = "SELECT id, name FROM docker_server ORDER BY name"

	var servers []map[string]interface{}
	servers = make([]map[string]interface{}, 0)

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

			err = rows.Scan(&id, &name)
			util.Raise(err)

			servers = append(
				servers,
				map[string]interface{}{
					"id":   id.Int64,
					"name": name.String,
				},
			)
		}
	}

	util.Api(response, 200, servers)
}
