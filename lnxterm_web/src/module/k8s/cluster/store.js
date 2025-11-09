import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  cluster: {},
  clusters: [],
  clusterDetailVisible: false,
  clusterFormAddVisible: false,
  clusterFormUpdateVisible: false,
  clusterTableLoading: false,
  eventListVisible: false,
};

const clusterSlice = createSlice({
  name: 'k8sCluster',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setCluster: (state, action) => {state.cluster = action.payload;},
    setClusters: (state, action) => {state.clusters = action.payload;},
    setClusterDetailVisible: (state, action) => {state.clusterDetailVisible = action.payload;},
    setClusterFormAddVisible: (state, action) => {state.clusterFormAddVisible = action.payload;},
    setClusterFormUpdateVisible: (state, action) => {state.clusterFormUpdateVisible = action.payload;},
    setClusterTableLoading: (state, action) => {state.clusterTableLoading = action.payload;},
    setEventListVisible: (state, action) => {state.eventListVisible = action.payload;},
  },
});

const getContext = (state) => state.k8sCluster.context;
const getCluster = (state) => state.k8sCluster.cluster;
const getClusters = (state) => state.k8sCluster.clusters;
const getClusterDetailVisible = (state) => state.k8sCluster.clusterDetailVisible;
const getClusterFormAddVisible = (state) => state.k8sCluster.clusterFormAddVisible;
const getClusterFormUpdateVisible = (state) => state.k8sCluster.clusterFormUpdateVisible;
const getClusterTableLoading = (state) => state.k8sCluster.clusterTableLoading;
const getEventListVisible = (state) => state.k8sCluster.eventListVisible;

const {setContext} = clusterSlice.actions;
const {setCluster} = clusterSlice.actions;
const {setClusters} = clusterSlice.actions;
const {setClusterDetailVisible} = clusterSlice.actions;
const {setClusterFormAddVisible} = clusterSlice.actions;
const {setClusterFormUpdateVisible} = clusterSlice.actions;
const {setClusterTableLoading} = clusterSlice.actions;
const {setEventListVisible} = clusterSlice.actions;

const store = {
  clusterSlice,
  getContext,
  getCluster,
  getClusters,
  getClusterDetailVisible,
  getClusterFormAddVisible,
  getClusterFormUpdateVisible,
  getClusterTableLoading,
  getEventListVisible,
  setContext,
  setCluster,
  setClusters,
  setClusterDetailVisible,
  setClusterFormAddVisible,
  setClusterFormUpdateVisible,
  setClusterTableLoading,
  setEventListVisible,
};

export default store;
