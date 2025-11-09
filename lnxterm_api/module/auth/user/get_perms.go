package user

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	auth_common "lnxterm/module/auth/common"
	"lnxterm/util"
)

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id string
	user_id = strings.TrimSpace(request.FormValue("user_id"))

	if util.IsNotSet(user_id) || util.IsNotInt(user_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids []int64
	perm_ids = make([]int64, 0)

	var checked_keys []string
	checked_keys = make([]string, 0)

	{
		var query string
		query = `
			SELECT perm_id FROM auth_user_perm WHERE user_id=?
			UNION
			SELECT perm_id FROM auth_role_perm WHERE role_id IN (
				SELECT role_id FROM auth_user_role WHERE user_id=?
			)
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query, user_id, user_id)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var perm_id int64

			err = rows.Scan(&perm_id)
			util.Raise(err)

			perm_ids = append(perm_ids, perm_id)

			checked_keys = append(checked_keys, fmt.Sprintf("%d", perm_id))
		}
	}

	var perm_tree map[string]interface{}
	perm_tree = auth_common.GetPermTree()

	var perms []map[string]interface{}
	perms = perm_tree["perms"].([]map[string]interface{})

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"perm_ids":      perm_ids,
		"checked_keys":  checked_keys,
		"expanded_keys": perm_tree["expanded_keys"],
	}

	util.Api(response, 200, perms, extras)
}
