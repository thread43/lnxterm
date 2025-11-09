package common

import (
	"crypto/md5"
	"fmt"
)

func EncryptPassword(password string, salt string) string {
	password = password + "|" + salt

	var password2 string
	password2 = fmt.Sprintf("%x", md5.Sum([]byte(password)))

	return password2
}
