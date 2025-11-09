import http from '../../../util/http.js';

function add_perm(perm) {
  const {code, name, type, remark, menu_id} = perm;

  const formData = new FormData();
  formData.append('code', code);
  formData.append('name', name);
  formData.append('type', type);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (menu_id !== undefined && menu_id !== null) {
    formData.append('menu_id', menu_id);
  }

  return http.post('/api/auth/perm/add_perm', formData);
}

function delete_perm(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/perm/delete_perm', formData);
}

function get_menus() {
  return http.get('/api/auth/perm/get_menus');
}

function get_perm(id) {
  return http.get('/api/auth/perm/get_perm?id=' + id);
}

function get_perms(menu_id) {
  if (menu_id !== undefined) {
    return http.get('/api/auth/perm/get_perms?menu_id=' + menu_id);
  } else {
    return http.get('/api/auth/perm/get_perms');
  }
}

function update_perm(perm) {
  const {id, code, name, type, remark, menu_id} = perm;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('code', code);
  formData.append('name', name);
  formData.append('type', type);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (menu_id !== undefined && menu_id !== null) {
    formData.append('menu_id', menu_id);
  }

  return http.post('/api/auth/perm/update_perm', formData);
}

const api = {
  add_perm,
  delete_perm,
  get_menus,
  get_perm,
  get_perms,
  update_perm,
};

export default api;
