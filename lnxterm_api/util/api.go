package util

import (
	"encoding/json"
	"log"
	"net/http"
)

func Api(response http.ResponseWriter, code int, args ...interface{}) {
	var err error

	var data map[string]interface{}
	data = map[string]interface{}{
		"code": code,
		"msg":  http.StatusText(code),
	}

	if len(args) == 0 {
	} else if len(args) == 1 {
		data["data"] = args[0]
	} else if len(args) == 2 {
		data["data"] = args[0]

		var key string
		var value interface{}

		for key, value = range args[1].(map[string]interface{}) {
			data[key] = value
		}
	} else {
	}

	var body []byte
	body, err = json.Marshal(data)
	Raise(err)

	log.Println("code:", code)
	// log.Println(string(body))

	response.Header().Set("Content-Type", "application/json; charset=utf-8")
	response.Header().Set("X-Content-Type-Options", "nosniff")
	response.WriteHeader(code)
	_, err = response.Write(body)
	Raise(err)
}
