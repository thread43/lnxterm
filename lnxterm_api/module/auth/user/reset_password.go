package user

import (
	"net/http"
	"strings"

	auth_user_common "lnxterm/module/auth/user/common"
	"lnxterm/util"
)

func ResetPassword(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var password string

	id = strings.TrimSpace(request.FormValue("id"))
	password = strings.TrimSpace(request.FormValue("password"))

	if util.IsNotSet(id, password) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var salt string
	salt = auth_user_common.GenerateSalt(8)

	var password2 string
	password2 = auth_user_common.EncryptPassword(password, salt)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = "UPDATE auth_user SET password=?, salt=?, update_time=? WHERE id=?"
		_, err = util.DB.Exec(query, password2, salt, update_time, id)
		util.Raise(err)
	}

	util.Api(response, 200)
}
