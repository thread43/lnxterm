package common

import (
	"lnxterm/util"
)

func UpdateHostInfo(id int64) error {
	var err error

	var host_info map[string]interface{}
	host_info, err = GetHostInfo(id)
	if err != nil {
		return err
	}

	var hostname string
	var ips string
	var os string
	var arch string
	var kernel string
	var cpu float64
	var memory float64
	var swap float64
	var disk float64

	hostname, _ = host_info["hostname"].(string)
	ips, _ = host_info["ips"].(string)
	os, _ = host_info["os"].(string)
	arch, _ = host_info["arch"].(string)
	kernel, _ = host_info["kernel"].(string)
	cpu, _ = host_info["cpu"].(float64)
	memory, _ = host_info["memory"].(float64)
	swap, _ = host_info["swap"].(float64)
	disk, _ = host_info["disk"].(float64)

	{
		var query string
		query = `
			UPDATE linux_host
			SET hostname=?, ips=?, os=?, arch=?, kernel=?, cpu=?, memory=?, swap=?, disk=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			hostname, ips, os, arch, kernel, cpu, memory, swap, disk,
			id,
		)
		if err != nil {
			return err
		}
	}

	return nil
}
