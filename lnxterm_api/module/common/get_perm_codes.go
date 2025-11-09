package common

import (
	"net/http"

	"github.com/gorilla/sessions"

	auth_user_common "lnxterm/module/auth/user/common"
	"lnxterm/util"
)

func GetPermCodes(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		panic("invalid session or token")
	}

	var perm_codes []string
	perm_codes = auth_user_common.GetPermCodes(int64(user_id.(int)))

	util.Api(response, 200, perm_codes)
}
