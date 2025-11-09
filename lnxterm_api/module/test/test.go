package test

import (
	"net/http"

	"lnxterm/util"
)

func Test(response http.ResponseWriter, request *http.Request) {
	var result map[string]interface{}
	result = make(map[string]interface{})

	result = map[string]interface{}{
		"x": 1,
		"y": 2,
	}

	util.Api(response, 200, result)
}
