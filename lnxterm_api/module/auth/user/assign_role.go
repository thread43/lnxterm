package user

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func AssignRole(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id string
	var role_ids string

	user_id = strings.TrimSpace(request.FormValue("user_id"))
	role_ids = strings.TrimSpace(request.FormValue("role_ids"))

	if util.IsNotSet(user_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(user_id) {
		util.Api(response, 400)
		return
	}

	var role_ids2 []string
	role_ids2 = strings.Split(role_ids, ",")

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	var tx *sql.Tx
	tx, err = util.DB.Begin()
	util.Raise(err)
	defer func() {
		_ = tx.Rollback()
	}()

	{
		var query string
		query = "DELETE FROM auth_user_role WHERE user_id=?"
		_, err = tx.Exec(query, user_id)
		util.Raise(err)
	}

	{
		var query string
		query = `
			INSERT INTO auth_user_role (user_id, role_id, create_time, update_time)
			VALUES (?,?,?,?)
		`

		var role_id string
		for _, role_id = range role_ids2 {
			if util.IsNotSet(role_id) {
				continue
			}
			if util.IsNotInt(role_id) {
				continue
			}

			_, err = tx.Exec(query, user_id, role_id, create_time, update_time)
			util.Raise(err)
		}
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
