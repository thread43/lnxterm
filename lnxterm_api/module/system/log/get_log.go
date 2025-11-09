package log

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxterm/util"
)

func GetLog(response http.ResponseWriter, request *http.Request) {
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

	var log map[string]interface{}
	log = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				log.id, log.path, log.ip, log.user_agent, log.referer, log.access_time,
				log.create_time, log.update_time,
				user.username, user.nickname
			FROM system_log log
			LEFT JOIN auth_user user ON log.user_id=user.id
			WHERE log.id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var path sql.NullString
		var ip sql.NullString
		var user_agent sql.NullString
		var referer sql.NullString
		var access_time sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var username sql.NullString
		var nickname sql.NullString

		err = row.Scan(
			&id2, &path, &ip, &user_agent, &referer, &access_time,
			&create_time, &update_time,
			&username, &nickname,
		)
		util.Raise(err)

		log = map[string]interface{}{
			"id":          id2.Int64,
			"path":        path.String,
			"ip":          ip.String,
			"user_agent":  user_agent.String,
			"referer":     referer.String,
			"access_time": util.TimeOf(access_time.String),
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"username":    username.String,
			"nickname":    nickname.String,
		}
	}

	util.Api(response, 200, log)
}
