package role

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

	var role_id string
	role_id = strings.TrimSpace(request.FormValue("role_id"))

	if util.IsNotSet(role_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(role_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids []int64
	perm_ids = make([]int64, 0)

	var checked_keys []string
	checked_keys = make([]string, 0)

	{
		var query string
		query = "SELECT perm_id FROM auth_role_perm WHERE role_id=?"

		var rows *sql.Rows
		rows, err = util.DB.Query(query, role_id)
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
