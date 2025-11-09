package common

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/sessions"

	"lnxterm/util"
)

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		panic("invalid session or token")
	}

	var perms []map[string]interface{}
	perms = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, code, name FROM auth_perm WHERE id IN (
				SELECT perm_id FROM auth_user_perm WHERE user_id=?
				UNION
				SELECT perm_id FROM auth_role_perm WHERE role_id IN (
					SELECT role_id FROM auth_user_role WHERE user_id=?
				)
			)
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query, user_id, user_id)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id string
			var code string
			var name string

			err = rows.Scan(&id, &code, &name)
			util.Raise(err)

			perms = append(
				perms,
				map[string]interface{}{
					"id":   id,
					"code": code,
					"name": name,
				},
			)
		}
	}

	util.Api(response, 200, perms)
}
