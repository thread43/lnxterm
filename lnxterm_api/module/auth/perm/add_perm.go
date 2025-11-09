package perm

import (
	"log"
	"net/http"
	"strings"

	"lnxterm/util"
)

// type2 -> rw_type?
func AddPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var code string
	var name string
	var type2 string
	var remark string
	var menu_id string

	code = strings.TrimSpace(request.FormValue("code"))
	name = strings.TrimSpace(request.FormValue("name"))
	type2 = strings.TrimSpace(request.FormValue("type"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	menu_id = strings.TrimSpace(request.FormValue("menu_id"))

	if util.IsNotSet(code, name) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(type2) {
		util.Api(response, 400)
		return
	}
	if menu_id != "" {
		if util.IsNotInt(menu_id) {
			util.Api(response, 400)
			return
		}
	}

	var menu_id2 interface{}
	if menu_id != "" {
		menu_id2 = menu_id
	}

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO auth_perm (code, name, type, remark, create_time, update_time, menu_id)
			VALUES (?,?,?,?,?,?,?)
		`
		_, err = util.DB.Exec(query, code, name, type2, remark, create_time, update_time, menu_id2)
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
