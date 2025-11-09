import {configureStore} from '@reduxjs/toolkit';
import commonStore from '../module/common/store.js';
import linuxHostStore from '../module/linux/host/store.js';
import dockerCommonStore from '../module/docker/common/store.js';
import dockerServerStore from '../module/docker/server/store.js';
import dockerImageStore from '../module/docker/image/store.js';
import dockerContainerStore from '../module/docker/container/store.js';
import k8sCommonStore from '../module/k8s/common/store.js';
import k8sClusterStore from '../module/k8s/cluster/store.js';
import k8sNamespaceStore from '../module/k8s/namesapce/store.js';
import k8sNodeStore from '../module/k8s/node/store.js';
import k8sDeploymentStore from '../module/k8s/deployment/store.js';
import k8sStatefulsetStore from '../module/k8s/statefulset/store.js';
import k8sPodStore from '../module/k8s/pod/store.js';
import k8sServiceStore from '../module/k8s/service/store.js';
import authDeptStore from '../module/auth/dept/store.js';
import authMenuStore from '../module/auth/menu/store.js';
import authPermStore from '../module/auth/perm/store.js';
import authRoleStore from '../module/auth/role/store.js';
import authUserStore from '../module/auth/user/store.js';
import systemLogStore from '../module/system/log/store.js';

const store = configureStore({
  reducer: {
    common: commonStore.commonSlice.reducer,

    linuxHost: linuxHostStore.hostSlice.reducer,

    dockerCommon: dockerCommonStore.commonSlice.reducer,
    dockerServer: dockerServerStore.serverSlice.reducer,
    dockerImage: dockerImageStore.imageSlice.reducer,
    dockerContainer: dockerContainerStore.containerSlice.reducer,

    k8sCommon: k8sCommonStore.commonSlice.reducer,
    k8sCluster: k8sClusterStore.clusterSlice.reducer,
    k8sNode: k8sNodeStore.nodeSlice.reducer,
    k8sNamespace: k8sNamespaceStore.namespaceSlice.reducer,
    k8sDeployment: k8sDeploymentStore.deploymentSlice.reducer,
    k8sStatefulset: k8sStatefulsetStore.statefulsetSlice.reducer,
    k8sPod: k8sPodStore.podSlice.reducer,
    k8sService: k8sServiceStore.serviceSlice.reducer,

    authDept: authDeptStore.deptSlice.reducer,
    authUser: authUserStore.userSlice.reducer,
    authRole: authRoleStore.roleSlice.reducer,
    authPerm: authPermStore.permSlice.reducer,
    authMenu: authMenuStore.menuSlice.reducer,

    systemLog: systemLogStore.logSlice.reducer,
  },
});

export default store;
