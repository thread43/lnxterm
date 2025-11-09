package log

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"lnxterm/util"
)

func GetLogs(response http.ResponseWriter, request *http.Request) {
	var err error

	var page string
	var size string

	page = strings.TrimSpace(request.FormValue("page"))
	size = strings.TrimSpace(request.FormValue("size"))

	if page != "" {
		if util.IsNotInt(page) {
			util.Api(response, 400)
			return
		}
	}
	if size != "" {
		if util.IsNotInt(size) {
			util.Api(response, 400)
			return
		}
	}

	var page2 int
	var size2 int

	page2 = 1
	size2 = 10

	if page != "" {
		page2, err = strconv.Atoi(page)
		util.Raise(err)
	}
	if size != "" {
		size2, err = strconv.Atoi(size)
		util.Raise(err)
	}

	var offset int
	var limit int

	offset = (page2 - 1) * size2
	if offset < 0 {
		offset = 0
	}
	limit = size2

	var total int

	{
		var query string
		query = "SELECT COUNT(1) count FROM system_log"

		var row *sql.Row
		row = util.DB.QueryRow(query)

		err = row.Scan(&total)
		util.Raise(err)
	}

	var logs []map[string]interface{}
	logs = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
				log.id, log.path, log.ip, log.user_agent, log.referer, log.access_time,
				user.username, user.nickname
			FROM system_log log
			LEFT JOIN auth_user user ON log.user_id=user.id
			ORDER BY log.id DESC
			LIMIT ? OFFSET ?
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query, limit, offset)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id int64
			var path string
			var ip string
			var user_agent string
			var referer string
			var access_time string
			var username sql.NullString
			var nickname sql.NullString

			err = rows.Scan(
				&id, &path, &ip, &user_agent, &referer, &access_time,
				&username, &nickname,
			)
			util.Raise(err)

			logs = append(
				logs,
				map[string]interface{}{
					"id":          id,
					"path":        path,
					"ip":          ip,
					"user_agent":  user_agent,
					"referer":     referer,
					"access_time": util.TimeOf(access_time),
					"username":    username.String,
					"nickname":    nickname.String,
				},
			)
		}
	}

	var pagination map[string]interface{}
	pagination = util.GetPagination(page2, size2, total)

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"pagination": pagination,
	}

	util.Api(response, 200, logs, extras)
}
