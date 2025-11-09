package role

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetRoles(response http.ResponseWriter, request *http.Request) {
	var err error

	var roles []map[string]interface{}
	roles = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name, remark FROM auth_role ORDER BY name"

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString
			var remark sql.NullString

			err = rows.Scan(&id, &name, &remark)
			util.Raise(err)

			roles = append(
				roles,
				map[string]interface{}{
					"id":     id.Int64,
					"name":   name.String,
					"remark": remark.String,
				},
			)
		}
	}

	util.Api(response, 200, roles)
}
