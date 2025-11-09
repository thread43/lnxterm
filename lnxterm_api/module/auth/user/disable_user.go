package user

import (
	"net/http"
	"strings"

	"lnxterm/util"
)

func DisableUser(response http.ResponseWriter, request *http.Request) {
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

	var update_time string
	update_time = util.TimeNow()

	var query string
	query = "UPDATE auth_user SET is_active=0, update_time=? WHERE id=?"
	_, err = util.DB.Exec(query, update_time, id)
	util.Raise(err)

	util.Api(response, 200)
}
