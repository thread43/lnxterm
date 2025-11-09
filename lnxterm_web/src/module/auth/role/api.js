import http from '../../../util/http.js';

function add_role(role) {
  const {name, remark} = role;

  const formData = new FormData();
  formData.append('name', name);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/role/add_role', formData);
}

function delete_role(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/role/delete_role', formData);
}

function get_perms(role_id) {
  return http.get('/api/auth/role/get_perms?role_id=' + role_id);
}

function get_role(id) {
  return http.get('/api/auth/role/get_role?id=' + id);
}

function get_roles() {
  return http.get('/api/auth/role/get_roles');
}

function grant_perm(role_id, perm_ids) {
  const formData = new FormData();
  formData.append('role_id', role_id);
  formData.append('perm_ids', perm_ids);

  return http.post('/api/auth/role/grant_perm', formData);
}

function update_role(role) {
  const {id, name, remark} = role;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/role/update_role', formData);
}

const api = {
  add_role,
  delete_role,
  get_perms,
  get_role,
  get_roles,
  grant_perm,
  update_role,
};

export default api;
