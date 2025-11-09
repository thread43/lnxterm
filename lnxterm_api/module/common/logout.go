package common

import (
	"log"
	"net/http"

	"github.com/gorilla/sessions"

	"lnxterm/util"
)

func Logout(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = util.STORE.Get(request, "whatever")
	util.Skip(err)

	session.Options.MaxAge = -1
	session.Options.Secure = false
	session.Options.SameSite = 1

	err = session.Save(request, response)
	if err != nil {
		log.Println(err)
		log.Println("can not delete a session")
	}

	util.Api(response, 200)
}
