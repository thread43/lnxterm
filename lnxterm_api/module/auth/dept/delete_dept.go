package dept

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func DeleteDept(response http.ResponseWriter, request *http.Request) {
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
		query = "DELETE FROM auth_dept WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	{
		var query string
		query = "UPDATE auth_user SET dept_id=NULL, update_time=? WHERE dept_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Raise(err)
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
