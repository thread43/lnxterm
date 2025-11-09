package host

import (
	"net/http"
	"strconv"
	"strings"

	"lnxterm/util"

	linux_host_common "lnxterm/module/linux/host/common"
)

func UpdateHost(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var ip string
	var ssh_host string
	var ssh_port string
	var ssh_user string
	var ssh_password string
	var ssh_private_key string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	ip = strings.TrimSpace(request.FormValue("ip"))
	ssh_host = strings.TrimSpace(request.FormValue("ssh_host"))
	ssh_port = strings.TrimSpace(request.FormValue("ssh_port"))
	ssh_user = strings.TrimSpace(request.FormValue("ssh_user"))
	ssh_password = strings.TrimSpace(request.FormValue("ssh_password"))
	ssh_private_key = strings.TrimSpace(request.FormValue("ssh_private_key"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(id, ip) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id, ssh_port) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE linux_host
			SET
				ip=?,
				ssh_host=?, ssh_port=?, ssh_user=?, ssh_password=?, ssh_private_key=?,
				remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			ip,
			ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key,
			remark, update_time,
			id,
		)
		util.Raise(err)
	}

	if ssh_host != "" {
		go func() {
			defer util.Catch()

			var id2 int64
			id2, err = strconv.ParseInt(id, 10, 64)
			util.Skip(err)

			err = linux_host_common.UpdateHostInfo(id2)
			util.Skip(err)
		}()
	}

	util.Api(response, 200)
}
