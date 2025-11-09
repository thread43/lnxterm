package user

import (
	"log"
	"net/http"
	"strings"

	auth_user_common "lnxterm/module/auth/user/common"
	"lnxterm/util"
)

func AddUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var username string
	var password string
	var nickname string
	var email string
	var phone string
	var is_admin string
	var remark string
	var dept_id string

	username = strings.TrimSpace(request.FormValue("username"))
	password = strings.TrimSpace(request.FormValue("password"))
	nickname = strings.TrimSpace(request.FormValue("nickname"))
	email = strings.TrimSpace(request.FormValue("email"))
	phone = strings.TrimSpace(request.FormValue("phone"))
	is_admin = strings.TrimSpace(request.FormValue("is_admin"))
	remark = strings.TrimSpace(request.FormValue("remark"))
	dept_id = strings.TrimSpace(request.FormValue("dept_id"))

	if util.IsNotSet(username, password, nickname, is_admin) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(is_admin) {
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

	var salt string
	salt = auth_user_common.GenerateSalt(8)

	var password2 string
	password2 = auth_user_common.EncryptPassword(password, salt)

	var is_staff int64
	var is_active int64
	var is_deleted int64

	is_staff = 1
	is_active = 1
	is_deleted = 0

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO auth_user (
				username, password, nickname, email, phone, is_admin,
				is_staff, is_active, salt,
				is_deleted, remark, create_time, update_time,
				dept_id
			)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
		`
		_, err = util.DB.Exec(
			query,
			username, password2, nickname, email, phone, is_admin,
			is_staff, is_active, salt,
			is_deleted, remark, create_time, update_time,
			dept_id2,
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
