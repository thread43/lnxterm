import http from '../../../util/http.js';

function get_log(id) {
  return http.get('/api/system/log/get_log?id=' + id);
}

function get_logs(page, size) {
  let url = '/api/system/log/get_logs';
  if (page !== undefined && size !== undefined) {
    url = url + '?page=' + page + '&size=' + size;
  }

  return http.get(url);
}

const api = {
  get_log,
  get_logs,
};

export default api;
