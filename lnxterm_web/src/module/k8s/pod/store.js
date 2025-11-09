import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  pod: {},
  pods: [],
  podDetailVisible: false,
  podYamlVisible: false,
  podLogVisible: false,
  podTerminalVisible: false,
  podFileBrowserVisible: false,
  podTableLoading: false,
};

const podSlice = createSlice({
  name: 'k8sPod',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setPod: (state, action) => {state.pod = action.payload;},
    setPods: (state, action) => {state.pods = action.payload;},
    setPodDetailVisible: (state, action) => {state.podDetailVisible = action.payload;},
    setPodYamlVisible: (state, action) => {state.podYamlVisible = action.payload;},
    setPodLogVisible: (state, action) => {state.podLogVisible = action.payload;},
    setPodTerminalVisible: (state, action) => {state.podTerminalVisible = action.payload;},
    setPodFileBrowserVisible: (state, action) => {state.podFileBrowserVisible = action.payload;},
    setPodTableLoading: (state, action) => {state.podTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sPod.context;
const getPod = (state) => state.k8sPod.pod;
const getPods = (state) => state.k8sPod.pods;
const getPodDetailVisible = (state) => state.k8sPod.podDetailVisible;
const getPodYamlVisible = (state) => state.k8sPod.podYamlVisible;
const getPodLogVisible = (state) => state.k8sPod.podLogVisible;
const getPodTerminalVisible = (state) => state.k8sPod.podTerminalVisible;
const getPodFileBrowserVisible = (state) => state.k8sPod.podFileBrowserVisible;
const getPodTableLoading = (state) => state.k8sPod.podTableLoading;

const {setContext} = podSlice.actions;
const {setPod} = podSlice.actions;
const {setPods} = podSlice.actions;
const {setPodDetailVisible} = podSlice.actions;
const {setPodYamlVisible} = podSlice.actions;
const {setPodLogVisible} = podSlice.actions;
const {setPodTerminalVisible} = podSlice.actions;
const {setPodFileBrowserVisible} = podSlice.actions;
const {setPodTableLoading} = podSlice.actions;

const store = {
  podSlice,
  getContext,
  getPod,
  getPods,
  getPodDetailVisible,
  getPodYamlVisible,
  getPodLogVisible,
  getPodTerminalVisible,
  getPodFileBrowserVisible,
  getPodTableLoading,
  setContext,
  setPod,
  setPods,
  setPodDetailVisible,
  setPodYamlVisible,
  setPodLogVisible,
  setPodTerminalVisible,
  setPodFileBrowserVisible,
  setPodTableLoading,
};

export default store;
