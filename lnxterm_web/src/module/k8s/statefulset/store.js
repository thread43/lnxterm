import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  statefulset: {},
  statefulsets: [],
  statefulsetDetailVisible: false,
  statefulsetLogVisible: false,
  statefulsetYamlVisible: false,
  statefulsetTableLoading: false,
};

const statefulsetSlice = createSlice({
  name: 'k8sStatefulset',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setStatefulset: (state, action) => {state.statefulset = action.payload;},
    setStatefulsets: (state, action) => {state.statefulsets = action.payload;},
    setStatefulsetDetailVisible: (state, action) => {state.statefulsetDetailVisible = action.payload;},
    setStatefulsetLogVisible: (state, action) => {state.statefulsetLogVisible = action.payload;},
    setStatefulsetYamlVisible: (state, action) => {state.statefulsetYamlVisible = action.payload;},
    setStatefulsetTableLoading: (state, action) => {state.statefulsetTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sStatefulset.context;
const getStatefulset = (state) => state.k8sStatefulset.statefulset;
const getStatefulsets = (state) => state.k8sStatefulset.statefulsets;
const getStatefulsetDetailVisible = (state) => state.k8sStatefulset.statefulsetDetailVisible;
const getStatefulsetLogVisible = (state) => state.k8sStatefulset.statefulsetLogVisible;
const getStatefulsetYamlVisible = (state) => state.k8sStatefulset.statefulsetYamlVisible;
const getStatefulsetTableLoading = (state) => state.k8sStatefulset.statefulsetTableLoading;

const {setContext} = statefulsetSlice.actions;
const {setStatefulset} = statefulsetSlice.actions;
const {setStatefulsets} = statefulsetSlice.actions;
const {setStatefulsetDetailVisible} = statefulsetSlice.actions;
const {setStatefulsetLogVisible} = statefulsetSlice.actions;
const {setStatefulsetYamlVisible} = statefulsetSlice.actions;
const {setStatefulsetTableLoading} = statefulsetSlice.actions;

const store = {
  statefulsetSlice,
  getContext,
  getStatefulset,
  getStatefulsets,
  getStatefulsetDetailVisible,
  getStatefulsetLogVisible,
  getStatefulsetYamlVisible,
  getStatefulsetTableLoading,
  setContext,
  setStatefulset,
  setStatefulsets,
  setStatefulsetDetailVisible,
  setStatefulsetLogVisible,
  setStatefulsetYamlVisible,
  setStatefulsetTableLoading,
};

export default store;
