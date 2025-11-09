package util

import (
	"errors"
	"log"
	"net/http"
	"runtime/debug"
	"strconv"
	"strings"
	"time"
)

func Skip(err error) {
	if err != nil {
		log.Println(err)
		log.Println("skip error")
	}
}

func Raise(err error) {
	if err != nil {
		panic(err)
	}
}

func Catch() {
	var err interface{}
	err = recover()
	if err != nil {
		log.Println(err)
		log.Println(string(debug.Stack()))
	}
}

func Catch500(response http.ResponseWriter) {
	var err interface{}
	err = recover()
	if err != nil {
		log.Println(err)
		log.Println(string(debug.Stack()))
		Api(response, 500)
	}
}

func Ensure(ok bool) {
	if !ok {
		panic(errors.New("type assertion not ok"))
	}
}

func IsSet(args ...string) bool {
	return !IsNotSet(args...)

}

func IsNotSet(args ...string) bool {
	var result bool

	var value string
	for _, value = range args {
		if value == "" || value == "undefined" || value == "null" {
			result = true
			break
		}
	}

	return result
}

func IsInt(args ...string) bool {
	return !IsNotInt(args...)
}

func IsNotInt(args ...string) bool {
	var err error

	var result bool

	var value string
	for _, value = range args {
		_, err = strconv.Atoi(value)
		if err != nil {
			result = true
			break
		}
	}

	return result
}

func TimeTaken(started time.Time, action string) {
	var elapsed time.Duration
	elapsed = time.Since(started)
	log.Printf("%v took %v\n", action, elapsed)
}

func TimeNow() string {
	return time.Now().Format("2006-01-02 15:04:05")
}

func TimeOf_(str string) string {
	var err error

	var x time.Time
	x, err = time.Parse(time.RFC3339, str)
	log.Println(err)

	return x.Format("2006-01-02 15:04:05")
}

// time.Time = "0001-01-01 00:00:00 +0000 UTC"
// RFC3339   = "2006-01-02T15:04:05Z07:00"
// sqlite    = "2006-01-02T15:04:05Z"
// mysql     = "2006-01-02 15:04:05"
// mysql     = "2006-01-02T15:04:05Z" (parseTime=true)
func TimeOf(str string) string {
	str = strings.Replace(str, "T", " ", 1)
	str = strings.Replace(str, "Z", "", 1)
	return str
}

func Contains(vs []string, x string) bool {
	var v string
	for _, v = range vs {
		if v == x {
			return true
		}
	}
	return false
}
