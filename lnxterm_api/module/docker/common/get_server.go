package common

import (
	"database/sql"

	"lnxterm/util"
)

func GetServer(id int64) (map[string]interface{}, error) {
	var err error

	var server map[string]interface{}
	server = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT id, name, host, remark, create_time, update_time
			FROM docker_server
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var name sql.NullString
		var host sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(&id2, &name, &host, &remark, &create_time, &update_time)
		if err != nil {
			return nil, err
		}

		server = map[string]interface{}{
			"id":          id2.Int64,
			"name":        name.String,
			"host":        host.String,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	return server, nil
}
