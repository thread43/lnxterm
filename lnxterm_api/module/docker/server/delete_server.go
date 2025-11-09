package server

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func DeleteServer(response http.ResponseWriter, request *http.Request) {
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
		query = "DELETE FROM docker_server WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Raise(err)
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
