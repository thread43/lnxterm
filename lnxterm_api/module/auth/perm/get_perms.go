package perm

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var menu_id string
	menu_id = strings.TrimSpace(request.FormValue("menu_id"))

	if menu_id != "" {
		if util.IsNotInt(menu_id) {
			util.Api(response, 400)
			return
		}
	}

	var perms []map[string]interface{}
	perms = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
				perm.id, perm.code, perm.name, perm.type, perm.remark,
				menu.name AS menu_name
			FROM auth_perm perm
			LEFT JOIN auth_menu menu ON perm.menu_id=menu.id
			%s
			ORDER BY perm.code
		`

		var args []interface{}
		if menu_id == "" {
			query = fmt.Sprintf(query, "")
		} else {
			query = fmt.Sprintf(query, "WHERE perm.menu_id=?")
			args = append(args, menu_id)
		}

		var rows *sql.Rows
		rows, err = util.DB.Query(query, args...)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var code sql.NullString
			var name sql.NullString
			var type2 sql.NullInt64
			var remark sql.NullString
			var menu_name sql.NullString

			err = rows.Scan(&id, &code, &name, &type2, &remark, &menu_name)
			util.Raise(err)

			perms = append(
				perms,
				map[string]interface{}{
					"id":        id.Int64,
					"code":      code.String,
					"name":      name.String,
					"type":      type2.Int64,
					"remark":    remark.String,
					"menu_name": menu_name.String,
				},
			)
		}
	}

	util.Api(response, 200, perms)
}
