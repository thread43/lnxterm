package menu

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func SortMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var id_sorts string
	id_sorts = strings.TrimSpace(request.FormValue("id_sorts"))

	if util.IsNotSet(id_sorts) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	var id_sorts2 []string
	id_sorts2 = strings.Split(id_sorts, ",")

	var tx *sql.Tx
	tx, err = util.DB.Begin()
	util.Raise(err)
	defer func() {
		_ = tx.Rollback()
	}()

	{
		var id_sort string
		for _, id_sort = range id_sorts2 {
			var fields []string
			fields = strings.Split(id_sort, "_")

			var id string
			var sort string

			id = fields[0]
			sort = fields[1]

			var query string
			query = "UPDATE auth_menu SET sort=?, update_time=? WHERE id=?"
			_, err = tx.Exec(query, sort, update_time, id)
			util.Raise(err)
		}
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
