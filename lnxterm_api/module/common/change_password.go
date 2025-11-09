package common

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/sessions"

	auth_user_common "lnxterm/module/auth/user/common"
	"lnxterm/util"
)

func ChangePassword(response http.ResponseWriter, request *http.Request) {
	var err error

	var old_password string
	var new_password string

	old_password = strings.TrimSpace(request.FormValue("old_password"))
	new_password = strings.TrimSpace(request.FormValue("new_password"))

	if util.IsNotSet(old_password, new_password) {
		util.Api(response, 400)
		return
	}

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	var username interface{}
	username = session.Values["username"]
	if username == nil {
		panic("invalid session or token")
	}

	var password string
	var salt string

	{
		var query string
		query = "SELECT password, salt FROM auth_user WHERE username=?"

		var row *sql.Row
		row = util.DB.QueryRow(query, username)
		err = row.Scan(&password, &salt)
		util.Raise(err)
	}

	var old_password2 string
	old_password2 = auth_user_common.EncryptPassword(old_password, salt)
	if old_password2 != password {
		util.Api(response, 422)
		return
	}

	var salt2 string
	salt2 = auth_user_common.GenerateSalt(8)

	var new_password2 string
	new_password2 = auth_user_common.EncryptPassword(new_password, salt2)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET password=?, salt=?, update_time=?
			WHERE username=? AND password=?
		`

		var result sql.Result
		result, err = util.DB.Exec(
			query,
			new_password2, salt2, update_time,
			username, old_password2,
		)
		util.Raise(err)

		var rows_affected int64
		rows_affected, err = result.RowsAffected()
		util.Raise(err)

		if rows_affected != 1 {
			log.Println(rows_affected)
			panic("updated failed")
		}
	}

	util.Api(response, 200)
}
