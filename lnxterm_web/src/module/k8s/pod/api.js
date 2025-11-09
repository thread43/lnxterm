import http from '../../../util/http.js';

function download_pod_file(pod, container_name, file) {
  const cluster_id = pod.cluster_id;
  const namespace = pod.namespace;
  const pod_name = pod.name;

  let url = '/api/k8s/pod/download_pod_file';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&pod_name=' + pod_name;
  url = url + '&container_name=' + container_name;
  url = url + '&file=' + encodeURIComponent(file);

  // return http.get(url);
  window.open(url, '_blank');
}

function download_pod_log(pod, container_name) {
  const cluster_id = pod.cluster_id;
  const namespace = pod.namespace;
  const pod_name = pod.name;

  let url = '/api/k8s/pod/download_pod_log';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&pod_name=' + pod_name;
  url = url + '&container_name=' + container_name;

  // return http.get(url);
  window.open(url, '_blank');
}

function get_clusters() {
  return http.get('/api/k8s/pod/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/pod/get_namespaces?cluster_id=' + cluster_id);
}

function get_pod_files(pod, container_name, dir) {
  const cluster_id = pod.cluster_id;
  const namespace = pod.namespace;
  const pod_name = pod.name;

  let url = '/api/k8s/pod/get_pod_files';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&pod_name=' + pod_name;
  url = url + '&container_name=' + container_name;
  url = url + '&dir=' + dir;

  return http.get(url);
}

function get_pod_log(pod, container_name) {
  const cluster_id = pod.cluster_id;
  const namespace = pod.namespace;
  const pod_name = pod.name;

  let url = '/api/k8s/pod/get_pod_log';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&pod_name=' + pod_name;
  url = url + '&container_name=' + container_name;

  return http.get(url);
}

function get_pod_yaml(pod) {
  const cluster_id = pod.cluster_id;
  const namespace = pod.namespace;
  const pod_name = pod.name;

  let url = '/api/k8s/pod/get_pod_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&pod_name=' + pod_name;

  return http.get(url);
}

function get_pods(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/pod/get_pods?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/pod/get_pods?cluster_id=' + cluster_id);
  }
}

const api = {
  download_pod_file,
  download_pod_log,
  get_clusters,
  get_namespaces,
  get_pod_files,
  get_pod_log,
  get_pod_yaml,
  get_pods,
};

export default api;
