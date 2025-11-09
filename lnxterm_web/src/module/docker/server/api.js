import http from '../../../util/http.js';

function add_server(server) {
  const {name, host, remark} = server;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('host', host);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/docker/server/add_server', formData);
}

function delete_server(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/docker/server/delete_server', formData);
}

function get_server(id) {
  return http.get('/api/docker/server/get_server?id=' + id);
}

function get_servers() {
  return http.get('/api/docker/server/get_servers');
}

function get_events(server_id) {
  return http.get('/api/docker/server/get_events?server_id=' + server_id);
}

function update_server(server) {
  const {id, name, host, remark} = server;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('host', host);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/docker/server/update_server', formData);
}

const api = {
  add_server,
  delete_server,
  get_server,
  get_servers,
  get_events,
  update_server,
};

export default api;
