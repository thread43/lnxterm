package server

import (
	"net/http"
	"strings"

	docker_server_common "lnxterm/module/docker/server/common"
	"lnxterm/util"
)

func UpdateServer(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var host string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	host = strings.TrimSpace(request.FormValue("host"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(id, name, host) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE docker_server SET name=?, host=?, remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name, host, remark, update_time,
			id,
		)
		util.Raise(err)
	}

	go func() {
		defer util.Catch()

		var version string
		version, err = docker_server_common.GetVersion(host)
		util.Skip(err)

		var query string
		query = "UPDATE docker_server SET version=? WHERE id=?"
		_, err = util.DB.Exec(query, version, id)
		util.Skip(err)
	}()

	util.Api(response, 200)
}
