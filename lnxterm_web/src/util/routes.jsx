import {BlockOutlined} from '@ant-design/icons';
import {DockerOutlined} from '@ant-design/icons';
import {LinuxOutlined} from '@ant-design/icons';
import {SafetyOutlined} from '@ant-design/icons';
import {SettingOutlined} from '@ant-design/icons';
import Index from '../module/index/Index.jsx';
import LinuxHost from '../module/linux/host/Index.jsx';
import DockerServer from '../module/docker/server/Index.jsx';
import DockerImage from '../module/docker/image/Index.jsx';
import DockerContainer from '../module/docker/container/Index.jsx';
import K8sCluster from '../module/k8s/cluster/Index.jsx';
import K8sNode from '../module/k8s/node/Index.jsx';
import K8sNamespace from '../module/k8s/namesapce/Index.jsx';
import K8sDeployment from '../module/k8s/deployment/Index.jsx';
import K8sStatefulset from '../module/k8s/statefulset/Index.jsx';
import K8sPod from '../module/k8s/pod/Index.jsx';
import K8sService from '../module/k8s/service/Index.jsx';
import AuthDept from '../module/auth/dept/Index.jsx';
import AuthUser from '../module/auth/user/Index.jsx';
import AuthRole from '../module/auth/role/Index.jsx';
import AuthPerm from '../module/auth/perm/Index.jsx';
import AuthMenu from '../module/auth/menu/Index.jsx';
import SystemLog from '../module/system/log/Index.jsx';
import NotFound from '../module/common/NotFound.jsx';

const routes = [
  {path: '/', component: Index},
  {path: '/index', component: Index},

  {path: '/linux', component: LinuxHost, alias: 'linux', icon: <LinuxOutlined />},
  {path: '/linux/host', component: LinuxHost, alias: 'linux_host'},

  {path: '/docker', component: DockerContainer, alias: 'docker', icon: <DockerOutlined />},
  {path: '/docker/server', component: DockerServer, alias: 'docker_server'},
  {path: '/docker/image', component: DockerImage, alias: 'docker_image'},
  {path: '/docker/container', component: DockerContainer, alias: 'docker_container'},

  {path: '/k8s', component: K8sPod, alias: 'k8s', icon: <BlockOutlined />},
  {path: '/k8s/cluster', component: K8sCluster, alias: 'k8s_cluster'},
  {path: '/k8s/node', component: K8sNode, alias: 'k8s_node'},
  {path: '/k8s/namespace', component: K8sNamespace, alias: 'k8s_namespace'},
  {path: '/k8s/deployment', component: K8sDeployment, alias: 'k8s_deployment'},
  {path: '/k8s/statefulset', component: K8sStatefulset, alias: 'k8s_statefulset'},
  {path: '/k8s/pod', component: K8sPod, alias: 'k8s_pod'},
  {path: '/k8s/service', component: K8sService, alias: 'k8s_service'},

  {path: '/auth', component: AuthUser, alias: 'auth', icon: <SafetyOutlined />},
  {path: '/auth/dept', component: AuthDept, alias: 'auth_dept'},
  {path: '/auth/user', component: AuthUser, alias: 'auth_user'},
  {path: '/auth/role', component: AuthRole, alias: 'auth_role'},
  {path: '/auth/perm', component: AuthPerm, alias: 'auth_perm'},
  {path: '/auth/menu', component: AuthMenu, alias: 'auth_menu'},

  {path: '/system', component: SystemLog, alias: 'system', icon: <SettingOutlined />},
  {path: '/system/log', component: SystemLog, alias: 'system_log'},

  {path: '*', component: NotFound},
];

export default routes;
