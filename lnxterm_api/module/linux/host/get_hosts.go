package host

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetHosts(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = `
		SELECT
			id, ip,
			ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key,
			hostname, ips, os, arch, kernel, cpu, memory, swap, disk,
			remark, create_time, update_time
		FROM linux_host
		ORDER BY ip
	`

	var hosts []map[string]interface{}
	hosts = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var ip sql.NullString
			var ssh_host sql.NullString
			var ssh_port sql.NullInt64
			var ssh_user sql.NullString
			var ssh_password sql.NullString
			var ssh_private_key sql.NullString
			var hostname sql.NullString
			var ips sql.NullString
			var os sql.NullString
			var arch sql.NullString
			var kernel sql.NullString
			var cpu sql.NullInt64
			var memory sql.NullInt64
			var swap sql.NullInt64
			var disk sql.NullInt64
			var remark sql.NullString
			var create_time sql.NullString
			var update_time sql.NullString

			err = rows.Scan(
				&id, &ip,
				&ssh_host, &ssh_port, &ssh_user, &ssh_password, &ssh_private_key,
				&hostname, &ips, &os, &arch, &kernel, &cpu, &memory, &swap, &disk,
				&remark, &create_time, &update_time,
			)
			util.Raise(err)

			var ssh_password2 string
			ssh_password2 = ssh_password.String
			if ssh_password2 != "" {
				ssh_password2 = "******"
			}

			hosts = append(
				hosts,
				map[string]interface{}{
					"id":              id.Int64,
					"ip":              ip.String,
					"ssh_host":        ssh_host.String,
					"ssh_port":        ssh_port.Int64,
					"ssh_user":        ssh_user.String,
					"ssh_password":    ssh_password2,
					"ssh_private_key": ssh_private_key.String,
					"hostname":        hostname.String,
					"ips":             ips.String,
					"os":              os.String,
					"arch":            arch.String,
					"kernel":          kernel.String,
					"cpu":             cpu.Int64,
					"memory":          memory.Int64,
					"swap":            swap.Int64,
					"disk":            disk.Int64,
					"remark":          remark.String,
					"create_time":     create_time.String,
					"update_time":     update_time.String,
				},
			)
		}
	}

	util.Api(response, 200, hosts)
}
