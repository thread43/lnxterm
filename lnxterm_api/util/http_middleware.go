package util

import (
	"net/http"
	"time"

	"github.com/gorilla/sessions"
)

func MakeHandler(next func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(response http.ResponseWriter, request *http.Request) {
		defer TimeTaken(time.Now(), request.URL.Path)

		defer Catch500(response)

		var err error

		var session *sessions.Session
		// open /tmp/session_xxx: no such file or directory
		// Get() always returns a session, even if empty
		session, err = STORE.Get(request, "whatever")
		Skip(err)

		var user_id interface{}
		var is_admin interface{}
		var perms interface{}

		user_id = session.Values["id"]
		is_admin = session.Values["is_admin"]
		perms = session.Values["perms"]

		go RecordRequest(request, user_id)

		var path string
		path = request.URL.Path

		if Contains(WHITELIST, path) {
			next(response, request)
			// return
		} else {
			if user_id == nil {
				Api(response, 401)
				return
			}

			var is_admin2 int64
			var perms2 []string

			is_admin2, _ = is_admin.(int64)
			perms2, _ = perms.([]string)

			if is_admin2 == 1 {
				next(response, request)
				// return
			} else {
				if Contains(perms2, path) {
					next(response, request)
					// return
				} else {
					Api(response, 403)
					return
				}
			}
		}

		// log.Println(response)

		// time.Sleep(2 * time.Second)
	}
}
