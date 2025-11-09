import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/deployment/get_clusters');
}

function get_deployment_yaml(deployment) {
  const cluster_id = deployment.cluster_id;
  const namespace = deployment.namespace;
  const name = deployment.name;

  let url = '/api/k8s/deployment/get_deployment_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_deployments(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/deployment/get_deployments?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/deployment/get_deployments?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/deployment/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_deployment_yaml,
  get_deployments,
  get_namespaces,
};

export default api;
