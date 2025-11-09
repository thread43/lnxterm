package role

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GrantPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var role_id string
	var perm_ids string

	role_id = strings.TrimSpace(request.FormValue("role_id"))
	perm_ids = strings.TrimSpace(request.FormValue("perm_ids"))

	if util.IsNotSet(role_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(role_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids2 []string
	perm_ids2 = strings.Split(perm_ids, ",")

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
		query = "DELETE FROM auth_role_perm WHERE role_id=?"
		_, err = tx.Exec(query, role_id)
		util.Raise(err)
	}

	{
		var query string
		query = `
			INSERT INTO auth_role_perm (role_id, perm_id, create_time, update_time)
			VALUES (?,?,?,?)
		`

		var perm_id string
		for _, perm_id = range perm_ids2 {
			if util.IsNotSet(perm_id) {
				continue
			}
			if util.IsNotInt(perm_id) {
				continue
			}

			_, err = tx.Exec(query, role_id, perm_id, create_time, update_time)
			util.Raise(err)
		}
	}

	err = tx.Commit()
	util.Raise(err)

	util.Api(response, 200)
}
