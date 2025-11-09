import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/namespace/get_clusters');
}

function get_namespace_yaml(namespace) {
  const cluster_id = namespace.cluster_id;
  const name = namespace.name;

  let url = '/api/k8s/namespace/get_namespace_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/namespace/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_namespace_yaml,
  get_namespaces,
};

export default api;
