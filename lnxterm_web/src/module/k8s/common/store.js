import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  clusters: [],
  namespaces: [],
};

const commonSlice = createSlice({
  name: 'k8sCommon',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setClusters: (state, action) => {state.clusters = action.payload;},
    setNamespaces: (state, action) => {state.namespaces = action.payload;},
  },
});

const getContext = (state) => state.k8sCommon.context;
const getClusters = (state) => state.k8sCommon.clusters;
const getNamespaces = (state) => state.k8sCommon.namespaces;

const {setContext} = commonSlice.actions;
const {setClusters} = commonSlice.actions;
const {setNamespaces} = commonSlice.actions;

const store = {
  commonSlice,
  getContext,
  getClusters,
  getNamespaces,
  setContext,
  setClusters,
  setNamespaces,
};

export default store;
