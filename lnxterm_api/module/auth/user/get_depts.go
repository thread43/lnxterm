package user

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetDepts(response http.ResponseWriter, request *http.Request) {
	var err error

	var depts []map[string]interface{}
	depts = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name FROM auth_dept ORDER BY name"

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

			depts = append(
				depts,
				map[string]interface{}{
					"id":   id.Int64,
					"name": name.String,
				},
			)
		}
	}

	util.Api(response, 200, depts)
}
