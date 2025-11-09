package user

import (
	"net/http"
	"strings"

	"lnxterm/util"
)

func UpdateUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var username string
	var nickname string
	var email string
	var phone string
	var is_admin string
	var remark string
	var dept_id string

	id = strings.TrimSpace(request.FormValue("id"))
	username = strings.TrimSpace(request.FormValue("username"))
	nickname = strings.TrimSpace(request.FormValue("nickname"))
	email = strings.TrimSpace(request.FormValue("email"))
	phone = strings.TrimSpace(request.FormValue("phone"))
	is_admin = strings.TrimSpace(request.FormValue("is_admin"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	dept_id = strings.TrimSpace(request.FormValue("dept_id"))

	if util.IsNotSet(id, username, nickname, is_admin) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id, is_admin) {
		util.Api(response, 400)
		return
	}
	if dept_id != "" {
		if util.IsNotInt(dept_id) {
			util.Api(response, 400)
			return
		}
	}

	var dept_id2 interface{}
	if dept_id != "" {
		dept_id2 = dept_id
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET
				username=?, nickname=?, email=?, phone=?, is_admin=?,
				remark=?, update_time=?,
				dept_id=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			username, nickname, email, phone, is_admin,
			remark, update_time,
			dept_id2,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
