package menu

import (
	"log"
	"net/http"
	"strings"

	"lnxterm/util"
)

func AddMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var code string
	var name string
	var is_virtual string
	var remark string
	var parent_menu_id string

	code = strings.TrimSpace(request.FormValue("code"))
	name = strings.TrimSpace(request.FormValue("name"))
	is_virtual = strings.TrimSpace(request.FormValue("is_virtual"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	parent_menu_id = strings.TrimSpace(request.FormValue("parent_menu_id"))

	if util.IsNotSet(code, name, is_virtual) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(is_virtual) {
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

	var sort int64
	var create_time string
	var update_time string

	sort = 0
	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO auth_menu (
				code, name, is_virtual, sort, remark, create_time, update_time,
				parent_menu_id
			)
			VALUES (?,?,?,?,?,?,?,?)
		`
		_, err = util.DB.Exec(
			query,
			code, name, is_virtual, sort, remark, create_time, update_time,
			parent_menu_id2,
		)
		if err != nil {
			log.Println(err)
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				util.Api(response, 409)
				return
			}
			if strings.Contains(err.Error(), "Error 1062 (23000): Duplicate entry") {
				util.Api(response, 409)
				return
			}
		}
		util.Raise(err)
	}

	util.Api(response, 200)
}
