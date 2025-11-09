package host

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetHost(response http.ResponseWriter, request *http.Request) {
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

	var host map[string]interface{}
	host = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, ip,
				ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key,
				remark, create_time, update_time
			FROM linux_host
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var ip sql.NullString
		var ssh_host sql.NullString
		var ssh_port sql.NullInt64
		var ssh_user sql.NullString
		var ssh_password sql.NullString
		var ssh_private_key sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(
			&id, &ip,
			&ssh_host, &ssh_port, &ssh_user, &ssh_password, &ssh_private_key,
			&remark, &create_time, &update_time,
		)
		util.Raise(err)

		host = map[string]interface{}{
			"id":              id.Int64,
			"ip":              ip.String,
			"ssh_host":        ssh_host.String,
			"ssh_port":        ssh_port.Int64,
			"ssh_user":        ssh_user.String,
			"ssh_password":    ssh_password.String,
			"ssh_private_key": ssh_private_key.String,
			"remark":          remark.String,
			"create_time":     util.TimeOf(create_time.String),
			"update_time":     util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, host)
}
