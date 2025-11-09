package server

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	docker_server_common "lnxterm/module/docker/server/common"
	"lnxterm/util"
)

func AddServer(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var host string
	var remark string

	name = strings.TrimSpace(request.FormValue("name"))
	host = strings.TrimSpace(request.FormValue("host"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(name, host) {
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
			INSERT INTO docker_server (name, host, remark, create_time, update_time)
			VALUES (?,?,?,?,?)
		`
		result, err = util.DB.Exec(
			query,
			name, host, remark, create_time, update_time,
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

	go func() {
		defer util.Catch()

		var version string
		version, err = docker_server_common.GetVersion(host)
		util.Skip(err)

		var query string
		query = "UPDATE docker_server SET version=? WHERE id=?"
		_, err = util.DB.Exec(query, version, last_insert_id)
		util.Skip(err)
	}()

	util.Api(response, 200)
}
