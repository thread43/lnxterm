import http from '../../../util/http.js';

function add_user(user) {
  const {username, password, nickname, email, phone, is_admin, remark, dept_id} = user;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (email !== undefined) {
    formData.append('email', email);
  }
  if (phone !== undefined) {
    formData.append('phone', phone);
  }
  formData.append('is_admin', is_admin);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (dept_id !== undefined && dept_id !== null) {
    formData.append('dept_id', dept_id);
  }

  return http.post('/api/auth/user/add_user', formData);
}

function assign_role(user_id, role_ids) {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('role_ids', role_ids);

  return http.post('/api/auth/user/assign_role', formData);
}

function delete_user(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/user/delete_user', formData);
}

function disable_user(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/user/disable_user', formData);
}

function enable_user(id) {
  const formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/user/enable_user', formData);
}

function get_depts() {
  return http.get('/api/auth/user/get_depts');
}

function get_perms(user_id) {
  return http.get('/api/auth/user/get_perms?user_id=' + user_id);
}

function get_roles(user_id) {
  return http.get('/api/auth/user/get_roles?id=' + user_id);
}

function get_user(id) {
  return http.get('/api/auth/user/get_user?id=' + id);
}

function get_users() {
  return http.get('/api/auth/user/get_users');
}

function grant_perm(user_id, perm_ids) {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('perm_ids', perm_ids);
  return http.post('/api/auth/user/grant_perm', formData);
}

function reset_password(user) {
  const {id, password} = user;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('password', password);

  return http.post('/api/auth/user/reset_password', formData);
}

function update_user(user) {
  const {id, username, password, nickname, email, phone, is_admin, remark, dept_id} = user;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (email !== undefined) {
    formData.append('email', email);
  }
  if (phone !== undefined) {
    formData.append('phone', phone);
  }
  formData.append('is_admin', is_admin);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (dept_id !== undefined && dept_id !== null) {
    formData.append('dept_id', dept_id);
  }

  return http.post('/api/auth/user/update_user', formData);
}

const api = {
  add_user,
  assign_role,
  delete_user,
  disable_user,
  enable_user,
  get_depts,
  get_perms,
  get_roles,
  get_user,
  get_users,
  grant_perm,
  reset_password,
  update_user,
};

export default api;
