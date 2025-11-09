package dept

import (
	"log"
	"net/http"
	"strings"

	"lnxterm/util"
)

func AddDept(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var remark string

	name = strings.TrimSpace(request.FormValue("name"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(name) {
		util.Api(response, 400)
		return
	}

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = "INSERT INTO auth_dept (name, remark, create_time, update_time) VALUES (?,?,?,?)"
		_, err = util.DB.Exec(query, name, remark, create_time, update_time)
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
	}

	util.Api(response, 200)
}
