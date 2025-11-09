package user

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetRoles(response http.ResponseWriter, request *http.Request) {
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

	var role_ids []int64
	role_ids = make([]int64, 0)

	{
		var query string
		query = "SELECT role_id FROM auth_user_role WHERE user_id=?"

		var rows *sql.Rows
		rows, err = util.DB.Query(query, id)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var role_id sql.NullInt64

			err = rows.Scan(&role_id)
			util.Raise(err)

			role_ids = append(role_ids, role_id.Int64)
		}
	}

	var roles []map[string]interface{}
	roles = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name FROM auth_role ORDER BY name"

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

			roles = append(
				roles,
				map[string]interface{}{
					"id":   id.Int64,
					"name": name.String,
				},
			)
		}
	}

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"role_ids":     role_ids,
		"checked_keys": role_ids,
	}

	util.Api(response, 200, roles, extras)
}
