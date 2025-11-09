import http from '../../../util/http.js';

function add_dept(dept) {
  const {name, remark} = dept;

  const formData = new FormData();
  formData.append('name', name);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/dept/add_dept', formData);
}

function delete_dept(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/dept/delete_dept', formData);
}

function get_dept(id) {
  return http.get('/api/auth/dept/get_dept?id=' + id);
}

function get_depts() {
  return http.get('/api/auth/dept/get_depts');
}

function update_dept(dept) {
  const {id, name, remark} = dept;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/dept/update_dept', formData);
}

const api = {
  add_dept,
  delete_dept,
  get_dept,
  get_depts,
  update_dept,
};

export default api;
