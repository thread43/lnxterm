package util

import (
	"database/sql"
	// "os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB = nil

// var STORE *sessions.CookieStore = nil
var STORE *sessions.FilesystemStore = nil

var WHITELIST []string = nil

func Init() {
	// InitDb()
	InitStore()
	InitWhitelist()
}

// sqlite = "lnxterm.db"
// https://golang.org/pkg/database/sql/#Open
func InitDbWithSqlite(sqlite string) {
	var err error

	if DB == nil {
		DB, err = sql.Open("sqlite3", sqlite)
		Raise(err)

		// defer db.Close()
		// err = db.Ping()
		// Raise(err)
	}
}

// mysql = "root:123456@tcp(127.0.0.1:3306)/lnxterm"
// https://golang.org/pkg/database/sql/#Open
func InitDbWithMysql(mysql string) {
	var err error

	if DB == nil {
		DB, err = sql.Open("mysql", mysql)
		Raise(err)
		DB.SetConnMaxLifetime(time.Minute * 3)
		DB.SetMaxOpenConns(10)
		DB.SetMaxIdleConns(10)
	}
}

func InitStore() {
	// var err error

	if STORE == nil {
		var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

		// // securecookie: the value is too long: 5564 (>4096)
		// STORE = sessions.NewCookieStore([]byte(key))

		// defaults to /tmp/session_xxx
		STORE = sessions.NewFilesystemStore("", []byte(key))

		// _, err = os.Stat("sessions")
		// if os.IsNotExist(err) {
		// 	   err = os.Mkdir("sessions", 0755)
		// 	   Raise(err)
		// }
		// STORE = sessions.NewFilesystemStore("sessions", []byte(key))

		// // securecookie: the value is too long: 5564 (>4096)
		// STORE.MaxLength(4096)
		STORE.MaxLength(10240)
	}
}

func InitWhitelist() {
	if WHITELIST == nil {
		WHITELIST = []string{
			"/api/common/change_password",
			"/api/common/get_current_user",
			"/api/common/get_menus",
			"/api/common/get_perm_codes",
			"/api/common/get_perms",
			"/api/common/login",
			"/api/common/logout",
			"/api/common/update_profile",
			"/favicon.ico",
		}
	}
}
