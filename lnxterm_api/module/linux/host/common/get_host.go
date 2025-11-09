package common

import (
	"database/sql"

	"lnxterm/util"
)

func GetHost(id int64) (map[string]interface{}, error) {
	var err error

	var ssh map[string]interface{}
	ssh = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT id, ip, ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key
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

		err = row.Scan(&id, &ip, &ssh_host, &ssh_port, &ssh_user, &ssh_password, &ssh_private_key)
		if err != nil {
			return nil, err
		}

		ssh = map[string]interface{}{
			"id":              id.Int64,
			"ip":              ip.String,
			"ssh_host":        ssh_host.String,
			"ssh_port":        ssh_port.Int64,
			"ssh_user":        ssh_user.String,
			"ssh_password":    ssh_password.String,
			"ssh_private_key": ssh_private_key.String,
		}
	}

	return ssh, nil
}
