-- auth_dept
-- auth_user
-- auth_role
-- auth_perm
-- auth_menu
-- auth_user_role
-- auth_role_perm
-- auth_user_perm
--
-- system_log
--
-- linux_host
--
-- docker_server
--
-- k8s_cluster

CREATE TABLE auth_dept (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_user (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(128),
  password VARCHAR(128),
  nickname VARCHAR(128),
  email VARCHAR(128),
  phone VARCHAR(128),
  is_admin INTEGER,
  is_staff INTEGER,
  is_active INTEGER,
  login_time DATETIME,
  salt VARCHAR(128),
  is_deleted INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  dept_id INTEGER,
  UNIQUE(username)
);

CREATE TABLE auth_role (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_perm (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(128),
  name VARCHAR(128),
  type INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  menu_id INTEGER,
  UNIQUE(code)
);

CREATE TABLE auth_menu (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(128),
  name VARCHAR(128),
  icon VARCHAR(128),
  sort INTEGER,
  is_virtual INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  parent_menu_id INTEGER,
  UNIQUE(code)
);

CREATE TABLE auth_user_role (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  role_id INTEGER,
  UNIQUE(user_id, role_id)
);

CREATE TABLE auth_role_perm (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  role_id INTEGER,
  perm_id INTEGER,
  UNIQUE(role_id, perm_id)
);

CREATE TABLE auth_user_perm (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  perm_id INTEGER,
  UNIQUE(user_id, perm_id)
);

CREATE TABLE system_log (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  path VARCHAR(128),
  ip VARCHAR(32),
  user_agent VARCHAR(256),
  referer VARCHAR(256),
  access_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER
);

CREATE TABLE linux_host (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  ip VARCHAR(128),
  ssh_host VARCHAR(128),
  ssh_port INTEGER,
  ssh_user VARCHAR(128),
  ssh_password VARCHAR(128),
  ssh_private_key TEXT,
  hostname VARCHAR(128),
  ips VARCHAR(256),
  os VARCHAR(128),
  arch VARCHAR(128),
  kernel VARCHAR(128),
  cpu INTEGER,
  memory INTEGER,
  swap INTEGER,
  disk INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ip)
);

CREATE TABLE docker_server (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  host VARCHAR(256),
  version VARCHAR(128),
  is_active INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE k8s_cluster (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  kubeconfig TEXT,
  server VARCHAR(256),
  version VARCHAR(128),
  is_active INTEGER,
  remark VARCHAR(128),
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
