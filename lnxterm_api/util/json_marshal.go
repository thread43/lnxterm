package util

import (
	"encoding/json"
	"log"
)

func JsonMarshal(value interface{}) string {
	var err error

	var value2 []byte
	value2, err = json.Marshal(value)
	if err != nil {
		log.Println(err)
	}

	log.Println(string(value2))

	return string(value2)
}

func JsonMarshalIndent(value interface{}) string {
	var err error

	var value2 []byte
	value2, err = json.MarshalIndent(value, "", "  ")
	if err != nil {
		log.Println(err)
	}

	log.Println(string(value2))

	return string(value2)
}

func JsonDump(value interface{}) string {
	return JsonMarshalIndent(value)
}

func JsonDump2(value interface{}) string {
	return JsonMarshal(value)
}

func Dump(value interface{}) string {
	return JsonMarshalIndent(value)
}

func Dump2(value interface{}) string {
	return JsonMarshal(value)
}
