import http from '../../../util/http.js';

function get_servers() {
  return http.get('/api/docker/image/get_servers');
}

function get_images(server_id) {
  return http.get('/api/docker/image/get_images?server_id=' + server_id);
}

const api = {
  get_servers,
  get_images,
};

export default api;
