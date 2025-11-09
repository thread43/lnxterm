package menu

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetMenu(response http.ResponseWriter, request *http.Request) {
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

	var parent_menu_ids map[int64]bool
	parent_menu_ids = make(map[int64]bool)

	{
		var query string
		query = `
			SELECT parent_menu_id, COUNT(1) count
			FROM auth_menu
			WHERE parent_menu_id IS NOT NULL
			GROUP BY parent_menu_id
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		var parent_menu_id sql.NullInt64
		var count sql.NullInt64

		for rows.Next() {
			err = rows.Scan(&parent_menu_id, &count)
			util.Raise(err)

			parent_menu_ids[parent_menu_id.Int64] = true
		}
	}

	var menu map[string]interface{}
	menu = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, code, name, is_virtual, sort, remark, create_time, update_time,
				parent_menu_id
			FROM auth_menu WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var code sql.NullString
		var name sql.NullString
		var is_virtual sql.NullInt64
		var sort sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var parent_menu_id sql.NullInt64

		err = row.Scan(
			&id2, &code, &name, &is_virtual, &sort, &remark, &create_time, &update_time,
			&parent_menu_id,
		)
		util.Raise(err)

		var has_children bool
		if parent_menu_ids[id2.Int64] {
			has_children = true
		}

		var parent_menu_id2 interface{}
		if parent_menu_id.Valid {
			parent_menu_id2 = parent_menu_id.Int64
		}

		menu = map[string]interface{}{
			"id":             id2.Int64,
			"code":           code.String,
			"name":           name.String,
			"is_virtual":     is_virtual.Int64,
			"sort":           sort.Int64,
			"remark":         remark.String,
			"create_time":    util.TimeOf(create_time.String),
			"update_time":    util.TimeOf(update_time.String),
			"parent_menu_id": parent_menu_id2,
			"has_children":   has_children,
		}
	}

	util.Api(response, 200, menu)
}
