package menu

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func DeleteMenu(response http.ResponseWriter, request *http.Request) {
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

	var update_time string
	update_time = util.TimeNow()

	var tx *sql.Tx
	tx, err = util.DB.Begin()
	util.Raise(err)
	defer func() {
		_ = tx.Rollback()
	}()

	{
		var query string
		query = "DELETE FROM auth_menu WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	{
		var query string
		query = "UPDATE auth_perm SET menu_id=NULL, update_time=? WHERE menu_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Raise(err)
	}

	{
		var query string
		query = "UPDATE auth_menu SET parent_menu_id=NULL, update_time=? WHERE parent_menu_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Raise(err)
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
