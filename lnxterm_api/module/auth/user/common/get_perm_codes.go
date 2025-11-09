package common

import (
	"database/sql"

	"lnxterm/util"
)

func GetPermCodes(user_id int64) []string {
	var err error

	var perm_codes []string

	{
		var query string
		query = `
			SELECT code FROM auth_perm WHERE id IN (
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
			var code string
			err = rows.Scan(&code)
			util.Raise(err)

			perm_codes = append(perm_codes, code)
		}
	}

	return perm_codes
}
