package perm

import (
	"net/http"
	"strings"

	"lnxterm/util"
)

func UpdatePerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var code string
	var name string
	var type2 string
	var remark string
	var menu_id string

	id = strings.TrimSpace(request.FormValue("id"))
	code = strings.TrimSpace(request.FormValue("code"))
	name = strings.TrimSpace(request.FormValue("name"))
	type2 = strings.TrimSpace(request.FormValue("type"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	menu_id = strings.TrimSpace(request.FormValue("menu_id"))

	if util.IsNotSet(id, code, name) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id, type2) {
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

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = "UPDATE auth_perm SET code=?, name=?, type=?, remark=?, update_time=?, menu_id=? WHERE id=?"
		_, err = util.DB.Exec(query, code, name, type2, remark, update_time, menu_id2, id)
		util.Raise(err)
	}

	util.Api(response, 200)
}
