import http from '../../../util/http.js';

function add_menu(menu) {
  const {code, name, is_virtual, remark, parent_menu_id} = menu;

  const formData = new FormData();
  formData.append('code', code);
  formData.append('name', name);
  formData.append('is_virtual', is_virtual);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (parent_menu_id !== undefined && parent_menu_id !== null) {
    formData.append('parent_menu_id', parent_menu_id);
  }

  return http.post('/api/auth/menu/add_menu', formData);
}

function delete_menu(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/auth/menu/delete_menu', formData);
}

function get_menu(id) {
  return http.get('/api/auth/menu/get_menu?id=' + id);
}

function get_menus() {
  return http.get('/api/auth/menu/get_menus');
}

function get_parent_menus() {
  return http.get('/api/auth/menu/get_parent_menus');
}

function sort_menu(id_sorts) {
  const formData = new FormData();
  formData.append('id_sorts', id_sorts);

  return http.post('/api/auth/menu/sort_menu', formData);
}

function update_menu(menu) {
  const {id, code, name, is_virtual, remark, parent_menu_id} = menu;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('code', code);
  formData.append('name', name);
  formData.append('is_virtual', is_virtual);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }
  if (parent_menu_id !== undefined && parent_menu_id !== null) {
    formData.append('parent_menu_id', parent_menu_id);
  }

  return http.post('/api/auth/menu/update_menu', formData);
}

const api = {
  add_menu,
  delete_menu,
  get_menu,
  get_menus,
  get_parent_menus,
  sort_menu,
  update_menu,
};

export default api;
