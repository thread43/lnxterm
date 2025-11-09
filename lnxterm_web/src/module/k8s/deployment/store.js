import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  deployment: {},
  deployments: [],
  deploymentDetailVisible: false,
  deploymentLogVisible: false,
  deploymentYamlVisible: false,
  deploymentTableLoading: false,
};

const deploymentSlice = createSlice({
  name: 'k8sDeployment',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setDeployment: (state, action) => {state.deployment = action.payload;},
    setDeployments: (state, action) => {state.deployments = action.payload;},
    setDeploymentDetailVisible: (state, action) => {state.deploymentDetailVisible = action.payload;},
    setDeploymentLogVisible: (state, action) => {state.deploymentLogVisible = action.payload;},
    setDeploymentYamlVisible: (state, action) => {state.deploymentYamlVisible = action.payload;},
    setDeploymentTableLoading: (state, action) => {state.deploymentTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sDeployment.context;
const getDeployment = (state) => state.k8sDeployment.deployment;
const getDeployments = (state) => state.k8sDeployment.deployments;
const getDeploymentDetailVisible = (state) => state.k8sDeployment.deploymentDetailVisible;
const getDeploymentLogVisible = (state) => state.k8sDeployment.deploymentLogVisible;
const getDeploymentYamlVisible = (state) => state.k8sDeployment.deploymentYamlVisible;
const getDeploymentTableLoading = (state) => state.k8sDeployment.deploymentTableLoading;

const {setContext} = deploymentSlice.actions;
const {setDeployment} = deploymentSlice.actions;
const {setDeployments} = deploymentSlice.actions;
const {setDeploymentDetailVisible} = deploymentSlice.actions;
const {setDeploymentLogVisible} = deploymentSlice.actions;
const {setDeploymentYamlVisible} = deploymentSlice.actions;
const {setDeploymentTableLoading} = deploymentSlice.actions;

const store = {
  deploymentSlice,
  getContext,
  getDeployment,
  getDeployments,
  getDeploymentDetailVisible,
  getDeploymentLogVisible,
  getDeploymentYamlVisible,
  getDeploymentTableLoading,
  setContext,
  setDeployment,
  setDeployments,
  setDeploymentDetailVisible,
  setDeploymentLogVisible,
  setDeploymentYamlVisible,
  setDeploymentTableLoading,
};

export default store;
