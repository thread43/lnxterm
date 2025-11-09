package common

func GetServerHost(id int64) (string, error) {
	var err error

	var server map[string]interface{}
	server, err = GetServer(id)
	if err != nil {
		return "", err
	}

	var host string
	host = server["host"].(string)

	return host, nil
}
