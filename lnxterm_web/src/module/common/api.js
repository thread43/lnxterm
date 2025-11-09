import http from '../../util/http.js';

function change_password(passwords) {
  const {old_password, new_password} = passwords;

  const formData = new FormData();
  formData.append('old_password', old_password);
  formData.append('new_password', new_password);

  return http.post('/api/common/change_password', formData);
}

function get_current_user() {
  return http.get('/api/common/get_current_user');
}

function get_menus() {
  return http.get('/api/common/get_menus');
}

function login(user) {
  const {username, password} = user;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return http.post('/api/common/login', formData);
}

function logout() {
  return http.get('/api/common/logout');
}

function update_profile(profile) {
  const {nickname, email} = profile;

  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('email', email);

  return http.post('/api/common/update_profile', formData);
}

const api = {
  change_password,
  get_current_user,
  get_menus,
  login,
  logout,
  update_profile,
};

export default api;
