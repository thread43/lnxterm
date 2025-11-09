package util

import (
	"log"
	"net/http"
)

func NotFound(response http.ResponseWriter, request *http.Request) {
}

func WrapHandler(handler http.Handler) http.Handler {
	return http.HandlerFunc(
		func(response http.ResponseWriter, request *http.Request) {
			log.Println(request.URL.Path)
			handler.ServeHTTP(response, request)
		},
	)
}

func GetIp(request *http.Request) string {
	var ip string
	ip = request.Header.Get("X-Real-Ip")

	if ip == "" {
		ip = request.Header.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = request.RemoteAddr
	}

	return ip
}
