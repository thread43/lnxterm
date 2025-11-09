package common

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/sessions"

	"lnxterm/util"
)

func GetCurrentUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	var username interface{}
	username = session.Values["username"]
	if username == nil {
		log.Println("invalid session or token")
		util.Api(response, 401)
		return
	}

	var user map[string]interface{}
	user = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, username, nickname, email, is_admin,
				remark, create_time, update_time, dept_id
			FROM auth_user
			WHERE username=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, username)

		var id sql.NullInt64
		var username2 sql.NullString
		var nickname sql.NullString
		var email sql.NullString
		var is_admin sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var dept_id sql.NullInt64

		err = row.Scan(
			&id, &username2, &nickname, &email, &is_admin,
			&remark, &create_time, &update_time, &dept_id,
		)
		util.Raise(err)

		user = map[string]interface{}{
			"id":          id.Int64,
			"username":    username2.String,
			"nickname":    nickname.String,
			"email":       email.String,
			"is_admin":    is_admin.Int64,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"dept_id":     dept_id.Int64,
		}
	}

	util.Api(response, 200, user)
}
