package role

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetRole(response http.ResponseWriter, request *http.Request) {
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

	var role map[string]interface{}
	role = make(map[string]interface{})

	{
		var query string
		query = "SELECT id, name, remark, create_time, update_time FROM auth_role WHERE id=?"

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var name sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(&id2, &name, &remark, &create_time, &update_time)
		util.Raise(err)

		role = map[string]interface{}{
			"id":          id2.Int64,
			"name":        name.String,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, role)
}
