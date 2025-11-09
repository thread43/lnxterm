import http from '../../../util/http.js';

function add_host(host) {
  const {ip, ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key, remark} = host;

  const formData = new FormData();
  formData.append('ip', ip);
  if (ssh_host !== undefined) {
    formData.append('ssh_host', ssh_host);
  }
  if (ssh_port !== undefined) {
    formData.append('ssh_port', ssh_port);
  }
  if (ssh_user !== undefined) {
    formData.append('ssh_user', ssh_user);
  }
  if (ssh_password !== undefined) {
    formData.append('ssh_password', ssh_password);
  }
  if (ssh_private_key !== undefined) {
    formData.append('ssh_private_key', ssh_private_key);
  }
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/host/add_host', formData);
}

function delete_host(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/host/delete_host', formData);
}

function download_host_file(host_id, ssh_host, file) {
  let url = '/api/linux/host/download_host_file';
  url = url + '?host_id=' + host_id;
  url = url + '&ssh_host=' + ssh_host;
  url = url + '&file=' + encodeURIComponent(file);

  // return http.get(url);
  window.open(url, '_blank');
}

function get_host(id) {
  return http.get('/api/linux/host/get_host?id=' + id);
}

function get_host_files(host_id, ssh_host, dir) {
  let url = '/api/linux/host/get_host_files';
  url = url + '?host_id=' + host_id;
  url = url + '&ssh_host=' + ssh_host;
  url = url + '&dir=' + encodeURIComponent(dir);

  return http.get(url);
}

function get_hosts() {
  return http.get('/api/linux/host/get_hosts');
}

function update_host(host) {
  const {id, ip, ssh_host, ssh_port, ssh_user, ssh_password, ssh_private_key, remark} = host;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('ip', ip);
  formData.append('ssh_host', ssh_host);
  formData.append('ssh_port', ssh_port);
  formData.append('ssh_user', ssh_user);
  if (ssh_password !== undefined) {
    formData.append('ssh_password', ssh_password);
  }
  if (ssh_private_key !== undefined) {
    formData.append('ssh_private_key', ssh_private_key);
  }
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/host/update_host', formData);
}

const api = {
  add_host,
  delete_host,
  download_host_file,
  get_host,
  get_host_files,
  get_hosts,
  update_host,
};

export default api;
