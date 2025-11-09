package user

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = strings.TrimSpace(request.FormValue("id"))

	if util.IsNotSet(id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var user map[string]interface{}
	user = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, username, nickname, email, phone, is_admin,
				remark, create_time, update_time, dept_id
			FROM auth_user
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var username sql.NullString
		var nickname sql.NullString
		var email sql.NullString
		var phone sql.NullString
		var is_admin sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var dept_id sql.NullInt64

		err = row.Scan(
			&id2, &username, &nickname, &email, &phone, &is_admin,
			&remark, &create_time, &update_time, &dept_id,
		)
		util.Raise(err)

		var dept_id2 interface{}
		if dept_id.Valid {
			dept_id2 = dept_id.Int64
		}

		user = map[string]interface{}{
			"id":          id2.Int64,
			"username":    username.String,
			"nickname":    nickname.String,
			"email":       email.String,
			"phone":       phone.String,
			"is_admin":    is_admin.Int64,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"dept_id":     dept_id2,
		}
	}

	util.Api(response, 200, user)
}
