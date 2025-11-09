INSERT INTO auth_dept
(id, name)
VALUES
(1, 'Development'),
(2, 'Operations' );


INSERT INTO auth_user
(id, username, password, nickname, email, is_admin, is_staff, is_active, salt, is_deleted, dept_id)
VALUES
(1, 'admin', 'eda88570dad35bc024dfd5ab8ac23e56', 'Admin', 'admin@example.com', 1, 1, 1, '12345678', 0, 1),
(2, 'guest', 'b4258ca8ea34375760bd99375e75128e', 'Guest', 'guest@example',     0, 1, 1, '12345678', 0, 2);


INSERT INTO auth_role
(id, name)
VALUES
(1, 'Administrator'),
(2, 'Guest'        );


INSERT INTO auth_perm
(code, name, type, menu_id)
VALUES
('/api/auth/dept/add_dept',                          'Auth - Departments - Add Department',              1, 2  ),
('/api/auth/dept/delete_dept',                       'Auth - Departments - Delete Department',           1, 2  ),
('/api/auth/dept/get_dept',                          'Auth - Departments - Get Department',              0, 2  ),
('/api/auth/dept/get_depts',                         'Auth - Departments - Get Departments',             0, 2  ),
('/api/auth/dept/update_dept',                       'Auth - Departments - Update Department',           1, 2  ),
('/api/auth/user/add_user',                          'Auth - Users - Add User',                          1, 3  ),
('/api/auth/user/assign_role',                       'Auth - Users - Assign Role',                       1, 3  ),
('/api/auth/user/delete_user',                       'Auth - Users - Delete User',                       1, 3  ),
('/api/auth/user/disable_user',                      'Auth - Users - Disable User',                      1, 3  ),
('/api/auth/user/enable_user',                       'Auth - Users - Enable User',                       1, 3  ),
('/api/auth/user/get_depts',                         'Auth - Users - Get Departments',                   0, 3  ),
('/api/auth/user/get_perms',                         'Auth - Users - Get Permissions',                   0, 3  ),
('/api/auth/user/get_roles',                         'Auth - Users - Get Roles',                         0, 3  ),
('/api/auth/user/get_user',                          'Auth - Users - Get User',                          0, 3  ),
('/api/auth/user/get_users',                         'Auth - Users - Get Users',                         0, 3  ),
('/api/auth/user/grant_perm',                        'Auth - Users - Grant Permission',                  1, 3  ),
('/api/auth/user/reset_password',                    'Auth - Users - Reset Password',                    1, 3  ),
('/api/auth/user/update_user',                       'Auth - Users - Update User',                       1, 3  ),
('/api/auth/role/add_role',                          'Auth - Roles - Add Role',                          1, 4  ),
('/api/auth/role/delete_role',                       'Auth - Roles - Delete Role',                       1, 4  ),
('/api/auth/role/get_perms',                         'Auth - Roles - Get Permissions',                   0, 4  ),
('/api/auth/role/get_role',                          'Auth - Roles - Get Role',                          0, 4  ),
('/api/auth/role/get_roles',                         'Auth - Roles - Get Roles',                         0, 4  ),
('/api/auth/role/grant_perm',                        'Auth - Roles - Grant Permission',                  1, 4  ),
('/api/auth/role/update_role',                       'Auth - Roles - Update Role',                       1, 4  ),
('/api/auth/perm/add_perm',                          'Auth - Permissions - Add Permission',              1, 5  ),
('/api/auth/perm/delete_perm',                       'Auth - Permissions - Delete Permission',           1, 5  ),
('/api/auth/perm/get_menus',                         'Auth - Permissions - Get Menus',                   0, 5  ),
('/api/auth/perm/get_perm',                          'Auth - Permissions - Get Permission',              0, 5  ),
('/api/auth/perm/get_perms',                         'Auth - Permissions - Get Permissions',             0, 5  ),
('/api/auth/perm/update_perm',                       'Auth - Permissions - Update Permission',           1, 5  ),
('/api/auth/menu/add_menu',                          'Auth - Menus - Add Menu',                          1, 6  ),
('/api/auth/menu/delete_menu',                       'Auth - Menus - Delete Menu',                       1, 6  ),
('/api/auth/menu/get_menu',                          'Auth - Menus - Get Menu',                          0, 6  ),
('/api/auth/menu/get_menus',                         'Auth - Menus - Get Menus',                         0, 6  ),
('/api/auth/menu/get_parent_menus',                  'Auth - Menus - Get Parent Menus',                  0, 6  ),
('/api/auth/menu/sort_menu',                         'Auth - Menus - Sort Menu',                         1, 6  ),
('/api/auth/menu/update_menu',                       'Auth - Menus - Update Menu',                       1, 6  ),
('/api/system/log/get_log',                          'System - Logs - Get Log',                          0, 102),
('/api/system/log/get_logs',                         'System - Logs - Get Logs',                         0, 102),
('/api/linux/host/add_host',                         'Linux - Hosts - Add Host',                         1, 202),
('/api/linux/host/delete_host',                      'Linux - Hosts - Delete Host',                      1, 202),
('/api/linux/host/download_host_file',               'Linux - Hosts - Download Host File',               0, 202),
('/api/linux/host/get_host',                         'Linux - Hosts - Get Host',                         0, 202),
('/api/linux/host/get_host_files',                   'Linux - Hosts - Get Host Files',                   0, 202),
('/api/linux/host/get_hosts',                        'Linux - Hosts - Get Host',                         0, 202),
('/api/linux/host/update_host',                      'Linux - Hosts - Update Host',                      1, 202),
('/api/linux/host/update_host_file',                 'Linux - Hosts - Update Host File',                 1, 202),
('/api/linux/host/ws_open_host_terminal',            'Linux - Hosts - WS Open Host Terminal',            1, 202),
('/api/docker/server/add_server',                    'Docker - Servers - Add Server',                    1, 302),
('/api/docker/server/delete_server',                 'Docker - Servers - Delete Server',                 1, 302),
('/api/docker/server/get_server',                    'Docker - Servers - Get Server',                    0, 302),
('/api/docker/server/get_servers',                   'Docker - Servers - Get Servers',                   0, 302),
('/api/docker/server/update_server',                 'Docker - Servers - Update Server',                 1, 302),
('/api/docker/image/get_images',                     'Docker - Images - Get Images',                     0, 303),
('/api/docker/image/get_servers',                    'Docker - Images - Get Servers',                    0, 303),
('/api/docker/container/download_container_file',    'Docker - Containers - Download Container File',    0, 304),
('/api/docker/container/download_container_log',     'Docker - Containers - Download Container Log',     0, 304),
('/api/docker/container/get_container_files',        'Docker - Containers - Get Container Files',        0, 304),
('/api/docker/container/get_container_log',          'Docker - Containers - Get Container Log',          0, 304),
('/api/docker/container/get_containers',             'Docker - Containers - Get Containers',             0, 304),
('/api/docker/container/get_servers',                'Docker - Containers - Get Servers',                0, 304),
('/api/docker/container/upload_container_file',      'Docker - Containers - Upload Container File',      1, 304),
('/api/docker/container/ws_open_container_terminal', 'Docker - Containers - WS Open Container Terminal', 1, 304),
('/api/k8s/cluster/add_cluster',                     'Kubernetes - Clusters - Add Cluster',              1, 402),
('/api/k8s/cluster/delete_cluster',                  'Kubernetes - Clusters - Delete Cluster',           1, 402),
('/api/k8s/cluster/get_cluster',                     'Kubernetes - Clusters - Get Cluster',              0, 402),
('/api/k8s/cluster/get_clusters',                    'Kubernetes - Clusters - Get Clusters',             0, 402),
('/api/k8s/cluster/get_events',                      'Kubernetes - Clusters - Get Events',               0, 402),
('/api/k8s/cluster/update_cluster',                  'Kubernetes - Clusters - Update Cluster',           1, 402),
('/api/k8s/node/get_clusters',                       'Kubernetes - Nodes - Get Clusters',                0, 403),
('/api/k8s/node/get_node_yaml',                      'Kubernetes - Nodes - Get Node YAML',               0, 403),
('/api/k8s/node/get_nodes',                          'Kubernetes - Nodes - Get Nodes',                   0, 403),
('/api/k8s/namespace/get_clusters',                  'Kubernetes - Namespaces - Get Clusters',           0, 404),
('/api/k8s/namespace/get_namespace_yaml',            'Kubernetes - Namespaces - Get Namespace YAML',     0, 404),
('/api/k8s/namespace/get_namespaces',                'Kubernetes - Namespaces - Get Namespaces',         0, 404),
('/api/k8s/deployment/get_clusters',                 'Kubernetes - Deployments - Get Clusters',          0, 405),
('/api/k8s/deployment/get_deployment_yaml',          'Kubernetes - Deployments - Get Department YAML',   0, 405),
('/api/k8s/deployment/get_deployments',              'Kubernetes - Deployments - Get Departments',       0, 405),
('/api/k8s/deployment/get_namespaces',               'Kubernetes - Deployments - Get Namespaces',        0, 405),
('/api/k8s/statefulset/get_clusters',                'Kubernetes - StatefulSets - Get Clusters',         0, 406),
('/api/k8s/statefulset/get_statefulset_yaml',        'Kubernetes - StatefulSets - Get StatefulSet YAML', 0, 406),
('/api/k8s/statefulset/get_statefulsets',            'Kubernetes - StatefulSets - Get StatefulSets',     0, 406),
('/api/k8s/statefulset/get_namespaces',              'Kubernetes - StatefulSets - Get Namespaces',       0, 406),
('/api/k8s/pod/download_pod_file',                   'Kubernetes - Pods - Download Pod File',            0, 407),
('/api/k8s/pod/download_pod_log',                    'Kubernetes - Pods - Download Pod Log',             0, 407),
('/api/k8s/pod/get_clusters',                        'Kubernetes - Pods - Get Clusters',                 0, 407),
('/api/k8s/pod/get_namespaces',                      'Kubernetes - Pods - Get Namespaces',               0, 407),
('/api/k8s/pod/get_pod_files',                       'Kubernetes - Pods - Get Pod Files',                0, 407),
('/api/k8s/pod/get_pod_log',                         'Kubernetes - Pods - Get Pod Log',                  0, 407),
('/api/k8s/pod/get_pod_yaml',                        'Kubernetes - Pods - Get Pod YAML',                 0, 407),
('/api/k8s/pod/get_pods',                            'Kubernetes - Pods - Get Pods',                     0, 407),
('/api/k8s/pod/upload_pod_file',                     'Kubernetes - Pods - Upload Pod File',              1, 407),
('/api/k8s/pod/ws_get_pod_log',                      'Kubernetes - Pods - WS Get Pod Log',               0, 407),
('/api/k8s/pod/ws_open_pod_terminal',                'Kubernetes - Pods - WS Open Pod Terminal',         1, 407),
('/api/k8s/service/get_clusters',                    'Kubernetes - Services - Get Clusters',             0, 408),
('/api/k8s/service/get_namespaces',                  'Kubernetes - Services - Get Namespaces',           0, 408),
('/api/k8s/service/get_service_yaml',                'Kubernetes - Services - Get Service YAML',         0, 408),
('/api/k8s/service/get_services',                    'Kubernetes - Services - Get Services',             0, 408);


INSERT INTO auth_menu
(id, code, name, sort, is_virtual, parent_menu_id)
VALUES
(1,   'auth',             'Auth',         31, 0, NULL),
(2,   'auth_dept',        'Departments',  32, 0, 1   ),
(3,   'auth_user',        'Users',        33, 0, 1   ),
(4,   'auth_role',        'Roles',        34, 0, 1   ),
(5,   'auth_perm',        'Permissions',  35, 0, 1   ),
(6,   'auth_menu',        'Menus',        36, 0, 1   ),
(101, 'system',           'System',       41, 0, NULL),
(102, 'system_log',       'Logs',         42, 0, 101 ),
(201, 'linux',            'Linux',        1,  0, NULL),
(202, 'linux_host',       'Hosts',        2,  0, 201 ),
(301, 'docker',           'Docker',       11, 0, NULL),
(302, 'docker_server',    'Servers',      12, 0, 301 ),
(303, 'docker_image',     'Images',       13, 0, 301 ),
(304, 'docker_container', 'Containers',   14, 0, 301 ),
(401, 'k8s',              'Kubernetes',   21, 0, NULL),
(402, 'k8s_cluster',      'Clusters',     22, 0, 401 ),
(403, 'k8s_node',         'Nodes',        23, 0, 401 ),
(404, 'k8s_namespace',    'Namespaces',   24, 0, 401 ),
(405, 'k8s_deployment',   'Deployments',  25, 0, 401 ),
(406, 'k8s_statefulset',  'StatefulSets', 26, 0, 401 ),
(407, 'k8s_pod',          'Pods',         27, 0, 401 ),
(408, 'k8s_service',      'Services',     28, 0, 401 );


INSERT INTO auth_user_role
(user_id, role_id)
VALUES
(1, 1),
(2, 2);
