package user

import (
	"database/sql"
	"net/http"

	"lnxterm/util"
)

func GetUsers(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id_dept_name map[int64]string
	user_id_dept_name = make(map[int64]string)

	{
		var query string
		query = `
			SELECT user.id, dept.name
			FROM auth_user user
			JOIN auth_dept dept ON user.dept_id=dept.id
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id int64
			var name string

			err = rows.Scan(&id, &name)
			util.Raise(err)

			user_id_dept_name[id] = name
		}
	}

	var user_id_role_names map[int64][]string
	user_id_role_names = make(map[int64][]string)

	{
		var query string
		query = `
			SELECT user_role.user_id, role.name
			FROM auth_user_role user_role
			JOIN auth_role role ON user_role.role_id=role.id
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var user_id sql.NullInt64
			var name sql.NullString

			err = rows.Scan(&user_id, &name)
			util.Raise(err)

			var user_id2 int64
			user_id2 = user_id.Int64

			if user_id_role_names[user_id2] == nil {
				user_id_role_names[user_id2] = []string{}
			}
			user_id_role_names[user_id2] = append(user_id_role_names[user_id2], name.String)
		}
	}

	var users []map[string]interface{}
	users = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, username, nickname, email, phone, is_admin, is_active, remark
			FROM auth_user
			WHERE is_deleted=0
			ORDER BY username
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var username sql.NullString
			var nickname sql.NullString
			var email sql.NullString
			var phone sql.NullString
			var is_admin sql.NullInt64
			var is_active sql.NullInt64
			var remark sql.NullString

			err = rows.Scan(&id, &username, &nickname, &email, &phone, &is_admin, &is_active, &remark)
			util.Raise(err)

			var dept_name string
			dept_name = user_id_dept_name[id.Int64]

			var role_names []string
			if user_id_role_names[id.Int64] != nil {
				role_names = user_id_role_names[id.Int64]
			} else {
				role_names = []string{}
			}

			users = append(
				users,
				map[string]interface{}{
					"id":         id.Int64,
					"username":   username.String,
					"nickname":   nickname.String,
					"email":      email.String,
					"phone":      phone.String,
					"is_admin":   is_admin.Int64,
					"is_active":  is_active.Int64,
					"remark":     remark.String,
					"dept_name":  dept_name,
					"role_names": role_names,
				},
			)
		}
	}

	util.Api(response, 200, users)
}
