package common

import (
	"context"

	"github.com/docker/docker/api/types/system"
	"github.com/docker/docker/client"

	"lnxterm/util"
)

func GetVersion(host string) (string, error) {
	var err error

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var info system.Info
	info, err = docker_client.Info(context.Background())
	util.Raise(err)

	var version string
	version = info.ServerVersion

	return version, nil
}
