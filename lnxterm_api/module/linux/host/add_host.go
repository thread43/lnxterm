package host

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"lnxterm/util"

	linux_host_common "lnxterm/module/linux/host/common"
)

func AddHost(response http.ResponseWriter, request *http.Request) {
	var err error

	var ip string
	var ssh_host string
	var ssh_port string
	var ssh_user string
	var ssh_password string
	var ssh_private_key string
	var remark string

	ip = strings.TrimSpace(request.FormValue("ip"))
	ssh_host = strings.TrimSpace(request.FormValue("ssh_host"))
	ssh_port = strings.TrimSpace(request.FormValue("ssh_port"))
	ssh_user = strings.TrimSpace(request.FormValue("ssh_user"))
	ssh_password = strings.TrimSpace(request.FormValue("ssh_password"))
	ssh_private_key = strings.TrimSpace(request.FormValue("ssh_private_key"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(ip) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(ssh_port) {
		util.Api(response, 400)
		return
	}

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	var last_insert_id int64

	{
		var query string
		var result sql.Result

		query = `
			INSERT INTO linux_host (
				ip,
				ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key,
				remark, create_time, update_time
			)
			VALUES (?,?,?,?,?,?,?,?,?)
		`
		result, err = util.DB.Exec(
			query,
			ip,
			ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key,
			remark, create_time, update_time,
		)
		if err != nil {
			log.Println(err)
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				util.Api(response, 409)
				return
			}
			if strings.Contains(err.Error(), "Error 1062 (23000): Duplicate entry") {
				util.Api(response, 409)
				return
			}
		}
		util.Raise(err)

		last_insert_id, err = result.LastInsertId()
		util.Skip(err)
	}

	if ssh_host != "" {
		go func() {
			defer util.Catch()

			err = linux_host_common.UpdateHostInfo(last_insert_id)
			util.Skip(err)
		}()
	}

	util.Api(response, 200)
}
