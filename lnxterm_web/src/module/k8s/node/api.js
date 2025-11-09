import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/node/get_clusters');
}

function get_node_yaml(node) {
  const cluster_id = node.cluster_id;
  const name = node.name;

  let url = '/api/k8s/node/get_node_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_nodes(cluster_id) {
  return http.get('/api/k8s/node/get_nodes?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_node_yaml,
  get_nodes,
};

export default api;
