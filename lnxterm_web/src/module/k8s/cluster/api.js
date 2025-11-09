import http from '../../../util/http.js';

function add_cluster(cluster) {
  const {name, kubeconfig, remark} = cluster;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('kubeconfig', kubeconfig);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/k8s/cluster/add_cluster', formData);
}

function delete_cluster(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/k8s/cluster/delete_cluster', formData);
}

function get_cluster(id) {
  return http.get('/api/k8s/cluster/get_cluster?id=' + id);
}

function get_clusters() {
  return http.get('/api/k8s/cluster/get_clusters');
}

function get_events(cluster_id) {
  return http.get('/api/k8s/cluster/get_events?cluster_id=' + cluster_id);
}

function update_cluster(cluster) {
  const {id, name, kubeconfig, remark} = cluster;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('kubeconfig', kubeconfig);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/k8s/cluster/update_cluster', formData);
}

const api = {
  add_cluster,
  delete_cluster,
  get_cluster,
  get_clusters,
  get_events,
  update_cluster,
};

export default api;
