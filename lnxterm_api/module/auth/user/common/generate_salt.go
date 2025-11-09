package common

import (
	"math/rand"
	"time"
)

func GenerateSalt(size int64) string {
	var chars string
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	var source rand.Source
	var seeded_rand *rand.Rand

	source = rand.NewSource(time.Now().UnixNano())
	seeded_rand = rand.New(source)

	var bytes []uint8
	bytes = make([]byte, size)

	var index int
	for index = range bytes {
		bytes[index] = chars[seeded_rand.Intn(len(chars))]
	}

	var salt string
	salt = string(bytes)

	return salt
}
