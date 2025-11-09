package common

func GetKubeconfig(cluster_id int64) ([]byte, error) {
	var err error

	var cluster map[string]interface{}
	cluster, err = GetCluster(cluster_id)
	if err != nil {
		return nil, err
	}

	var kubeconfig string
	kubeconfig, _ = cluster["kubeconfig"].(string)

	var kubeconfig2 []byte
	kubeconfig2, err = ParseKubeconfig(kubeconfig)
	if err != nil {
		return nil, err
	}

	return kubeconfig2, nil
}
