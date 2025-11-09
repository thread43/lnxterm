import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/statefulset/get_clusters');
}

function get_statefulset_yaml(statefulset) {
  const cluster_id = statefulset.cluster_id;
  const namespace = statefulset.namespace;
  const name = statefulset.name;

  let url = '/api/k8s/statefulset/get_statefulset_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_statefulsets(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/statefulset/get_statefulsets?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/statefulset/get_statefulsets?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/statefulset/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_statefulset_yaml,
  get_statefulsets,
  get_namespaces,
};

export default api;
