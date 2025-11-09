import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/service/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/service/get_namespaces?cluster_id=' + cluster_id);
}

function get_service_yaml(service) {
  const cluster_id = service.cluster_id;
  const namespace = service.namespace;
  const name = service.name;

  let url = '/api/k8s/service/get_service_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_services(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/service/get_services?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/service/get_services?cluster_id=' + cluster_id);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_service_yaml,
  get_services,
};

export default api;
