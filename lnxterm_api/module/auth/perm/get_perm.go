package perm

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetPerm(response http.ResponseWriter, request *http.Request) {
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

	var perm map[string]interface{}
	perm = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT id, code, name, type, remark, create_time, update_time, menu_id
			FROM auth_perm
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var code sql.NullString
		var name sql.NullString
		var type2 sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var menu_id sql.NullInt64

		err = row.Scan(&id2, &code, &name, &type2, &remark, &create_time, &update_time, &menu_id)
		util.Raise(err)

		var menu_id2 interface{}
		if menu_id.Valid {
			menu_id2 = menu_id.Int64
		}

		perm = map[string]interface{}{
			"id":          id2.Int64,
			"code":        code.String,
			"name":        name.String,
			"type":        type2.Int64,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"menu_id":     menu_id2,
		}
	}

	util.Api(response, 200, perm)
}
