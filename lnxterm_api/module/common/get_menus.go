package common

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/sessions"

	"lnxterm/util"
)

func GetMenus(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		log.Println("invalid session or token")
		util.Api(response, 401)
		return
	}

	var is_admin interface{}
	is_admin = session.Values["is_admin"]
	if is_admin == nil {
		log.Println("invalid session or token")
		util.Api(response, 401)
		return
	}

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	var parent_menu_ids []interface{}
	parent_menu_ids = make([]interface{}, 0)

	{
		var query string

		var args []interface{}
		args = make([]interface{}, 0)

		if is_admin == int64(1) {
			query = `
				SELECT id, code, name, parent_menu_id FROM auth_menu
				WHERE is_virtual=0
				ORDER BY sort, code
			`
		} else {
			query = `
				SELECT id, code, name, parent_menu_id FROM auth_menu
				WHERE is_virtual=0
				AND id IN (
					SELECT menu_id FROM auth_perm WHERE id IN (
						SELECT perm_id FROM auth_user_perm WHERE user_id=?
						UNION
						SELECT perm_id FROM auth_role_perm WHERE role_id IN (
							SELECT role_id FROM auth_user_role WHERE user_id=?
						)
					)
				)
				ORDER BY sort, code
			`
			args = []interface{}{user_id, user_id}
		}

		var rows *sql.Rows
		rows, err = util.DB.Query(query, args...)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		var id int64
		var code string
		var name string
		var parent_menu_id sql.NullInt64

		for rows.Next() {
			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Raise(err)

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"parent_menu_id": parent_menu_id.Int64,
				},
			)

			parent_menu_ids = append(parent_menu_ids, parent_menu_id.Int64)
		}
	}

	var menus2 []map[string]interface{}
	menus2 = make([]map[string]interface{}, 0)

	if len(menus) > 0 {
		var question_marks string
		question_marks = strings.Repeat("?,", len(parent_menu_ids))
		question_marks = strings.TrimSuffix(question_marks, ",")

		var query string
		query = `
			SELECT id, code, name, parent_menu_id
			FROM auth_menu
			WHERE is_virtual=0
			AND id IN (%s)
			ORDER BY sort, code
		`
		query = fmt.Sprintf(query, question_marks)
		log.Println(query)

		var rows *sql.Rows
		rows, err = util.DB.Query(query, parent_menu_ids...)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id int64
			var code string
			var name string
			var parent_menu_id sql.NullInt64

			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Raise(err)

			menus2 = append(
				menus2,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"parent_menu_id": parent_menu_id.Int64,
				},
			)
		}
	}

	var menus3 map[int64][]map[string]interface{}
	menus3 = make(map[int64][]map[string]interface{})

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var parent_menu_id int64
			parent_menu_id, _ = menu["parent_menu_id"].(int64)
			menus3[parent_menu_id] = append(menus3[parent_menu_id], menu)
		}
	}

	var menus4 []map[string]interface{}
	menus4 = make([]map[string]interface{}, 0)

	{
		var menu map[string]interface{}
		for _, menu = range menus2 {
			var id int64
			id, _ = menu["id"].(int64)
			menu["children"] = menus3[id]
			menus4 = append(menus4, menu)
		}
	}

	util.Api(response, 200, menus4)
}
