package menu

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func UpdateMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var code string
	var name string
	var is_virtual string
	var remark string
	var parent_menu_id string

	id = strings.TrimSpace(request.FormValue("id"))
	code = strings.TrimSpace(request.FormValue("code"))
	name = strings.TrimSpace(request.FormValue("name"))
	is_virtual = strings.TrimSpace(request.FormValue("is_virtual"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	parent_menu_id = strings.TrimSpace(request.FormValue("parent_menu_id"))

	if util.IsNotSet(id, code, name, is_virtual) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id, is_virtual) {
		util.Api(response, 400)
		return
	}
	if parent_menu_id != "" {
		if util.IsNotInt(parent_menu_id) {
			util.Api(response, 400)
			return
		}
	}

	var parent_menu_id2 interface{}
	if parent_menu_id != "" {
		parent_menu_id2 = parent_menu_id
	}

	var update_time string
	update_time = util.TimeNow()

	var has_children bool

	{
		var query string
		query = "SELECT COUNT(1) count FROM auth_menu WHERE parent_menu_id=?"

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var count int64
		err = row.Scan(&count)
		util.Raise(err)

		if count > 0 {
			has_children = true
		}
	}

	var query string
	if id == parent_menu_id || has_children {
		query = `
			UPDATE auth_menu
			SET code=?, name=?, is_virtual=?, remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			code, name, is_virtual, remark, update_time,
			id,
		)
		util.Raise(err)
	} else {
		query = `
			UPDATE auth_menu
			SET code=?, name=?, is_virtual=?, remark=?, update_time=?, parent_menu_id=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			code, name, is_virtual, remark, update_time, parent_menu_id2,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
