package menu

import (
	"database/sql"
	"log"
	"net/http"

	"lnxterm/util"
)

func GetParentMenus(response http.ResponseWriter, request *http.Request) {
	var err error

	var parent_menus []map[string]interface{}
	parent_menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name FROM auth_menu WHERE parent_menu_id IS NULL ORDER BY code"

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var code sql.NullString
			var name sql.NullString

			err = rows.Scan(&id, &code, &name)
			if err != nil {
				log.Println(err)
				break
			}

			parent_menus = append(
				parent_menus,
				map[string]interface{}{
					"id":   id.Int64,
					"code": code.String,
					"name": name.String,
				},
			)
		}
	}

	util.Api(response, 200, parent_menus)
}
