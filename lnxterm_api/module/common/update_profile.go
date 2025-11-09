package common

import (
	"net/http"
	"strings"

	"github.com/gorilla/sessions"

	"lnxterm/util"
)

func UpdateProfile(response http.ResponseWriter, request *http.Request) {
	var err error

	var nickname string
	var email string

	nickname = strings.TrimSpace(request.FormValue("nickname"))
	email = strings.TrimSpace(request.FormValue("email"))

	if util.IsNotSet(nickname) {
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

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET nickname=?, email=?, update_time=?
			WHERE username=?
		`
		_, err = util.DB.Exec(
			query,
			nickname, email, update_time,
			username,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
