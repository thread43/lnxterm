package user

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func DeleteUser(response http.ResponseWriter, request *http.Request) {
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

	var tx *sql.Tx
	tx, err = util.DB.Begin()
	util.Raise(err)
	defer func() {
		_ = tx.Rollback()
	}()

	{
		var query string
		query = "UPDATE auth_user SET is_deleted=1 WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_role WHERE user_id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_perm WHERE user_id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
