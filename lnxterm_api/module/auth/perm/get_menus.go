package perm

import (
	"database/sql"
	"fmt"
	"net/http"

	"lnxterm/util"
)

func GetMenus(response http.ResponseWriter, request *http.Request) {
	var err error

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name, parent_menu_id FROM auth_menu ORDER BY sort, code"

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		var id sql.NullInt64
		var code sql.NullString
		var name sql.NullString
		var parent_menu_id sql.NullInt64
		var is_parent bool

		for rows.Next() {
			is_parent = false

			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Raise(err)

			if !parent_menu_id.Valid {
				is_parent = true
			}

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id.Int64,
					"code":           code.String,
					"name":           name.String,
					"parent_menu_id": parent_menu_id.Int64,
					"is_parent":      is_parent,
				},
			)
		}
	}

	var menu_id_names map[int64]string
	menu_id_names = make(map[int64]string)

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var id int64
			var name string

			id, _ = menu["id"].(int64)
			name, _ = menu["name"].(string)

			menu_id_names[id] = name
		}
	}

	var menus2 map[int64][]map[string]interface{}
	menus2 = make(map[int64][]map[string]interface{})

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var parent_menu_id int64
			parent_menu_id, _ = menu["parent_menu_id"].(int64)

			if parent_menu_id == 0 {
				menu["alias"] = menu["name"]
			} else {
				menu["alias"] = fmt.Sprintf("%s - %s", menu_id_names[parent_menu_id], menu["name"])
			}

			menus2[parent_menu_id] = append(menus2[parent_menu_id], menu)
		}
	}

	var menus3 []map[string]interface{}
	menus3 = make([]map[string]interface{}, 0)

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var id int64
			var parent_menu_id int64

			id, _ = menu["id"].(int64)
			parent_menu_id, _ = menu["parent_menu_id"].(int64)

			if parent_menu_id == 0 {
				menus3 = append(menus3, menu)
				menus3 = append(menus3, menus2[id]...)
			}
		}
	}

	util.Api(response, 200, menus3)
}
