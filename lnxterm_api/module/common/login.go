package common

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/sessions"

	auth_user_common "lnxterm/module/auth/user/common"
	"lnxterm/util"
)

func Login(response http.ResponseWriter, request *http.Request) {
	var err error

	var username string
	var password string

	username = strings.TrimSpace(request.FormValue("username"))
	password = strings.TrimSpace(request.FormValue("password"))

	if util.IsNotSet(username, password) {
		util.Api(response, 400)
		return
	}

	var id sql.NullInt64
	var username2 sql.NullString
	var password2 sql.NullString
	var nickname sql.NullString
	var email sql.NullString
	var is_admin sql.NullInt64
	var salt sql.NullString
	var remark sql.NullString

	{
		var query string
		query = `
			SELECT id, username, password, nickname, email, is_admin, salt, remark
			FROM auth_user
			WHERE username=? AND is_active=1 AND is_deleted=0
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, username)
		err = row.Scan(&id, &username2, &password2, &nickname, &email, &is_admin, &salt, &remark)

		if err != nil {
			log.Println(err)
			if errors.Is(err, sql.ErrNoRows) {
				util.Api(response, 422)
				return
			} else {
				util.Raise(err)
			}
		}
	}

	var password3 string
	password3 = auth_user_common.EncryptPassword(password, salt.String)
	if password3 != password2.String {
		util.Api(response, 422)
		return
	}

	go func() {
		defer util.Catch()

		var login_time string
		login_time = util.TimeNow()

		var query string
		query = "UPDATE auth_user SET login_time=? WHERE id=?"

		_, err = util.DB.Exec(query, login_time, id.Int64)
		util.Skip(err)
	}()

	var perms []string
	perms = auth_user_common.GetPermCodes(id.Int64)

	var session *sessions.Session
	// open /tmp/session_xxx: no such file or directory
	// Get() always returns a session, even if empty
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	session.Options.MaxAge = 86400 * 1

	// Cookie "xxx" has been rejected because a non-HTTPS cookie can't be set as "secure".
	// the latest version "github.com/gorilla/sessions" changed defaut to "Secure=true"
	// https://github.com/gorilla/sessions/commit/ef99c782e9aae430b326a614151c983dcd7c2c1d
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
	session.Options.Secure = false

	// Cookie "xxx" rejected because it has the "SameSite=None" attribute but is missing the "secure" attribute.
	// the latest version "github.com/gorilla/sessions" changed default to "SameSite=None"
	// https://github.com/gorilla/sessions/commit/ef99c782e9aae430b326a614151c983dcd7c2c1d
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
	//
	// http.SameSiteDefaultMode=1, not setting SameSite, defaults to SameSite=Lax in most modern browsers
	// http.SameSiteLaxMode=2, SameSite=Lax
	// http.SameSiteStrictMode=3, SameSite=Strict
	// http.SameSiteNoneMode=4, SameSite=None
	session.Options.SameSite = 1

	session.Values["id"] = id.Int64
	session.Values["username"] = username
	session.Values["is_admin"] = is_admin.Int64
	session.Values["perms"] = perms

	err = session.Save(request, response)
	if err != nil {
		log.Println(err)
		panic("can not set a session")
	}

	var user map[string]interface{}
	user = make(map[string]interface{})

	user["id"] = id.Int64
	user["username"] = username
	user["nickname"] = nickname.String
	user["email"] = email.String
	user["is_admin"] = is_admin.Int64
	user["remark"] = remark.String

	util.Api(response, 200, user)
}
