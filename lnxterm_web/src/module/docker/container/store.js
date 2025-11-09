import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  container: {},
  containers: [],
  containerDetailVisible: false,
  containerLogVisible: false,
  containerTerminalVisible: false,
  containerFileBrowserVisible: false,
  containerTableLoading: false,
};

const containerSlice = createSlice({
  name: 'dockerContainer',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setContainer: (state, action) => {state.container = action.payload;},
    setContainers: (state, action) => {state.containers = action.payload;},
    setContainerDetailVisible: (state, action) => {state.containerDetailVisible = action.payload;},
    setContainerLogVisible: (state, action) => {state.containerLogVisible = action.payload;},
    setContainerTerminalVisible: (state, action) => {state.containerTerminalVisible = action.payload;},
    setContainerFileBrowserVisible: (state, action) => {state.containerFileBrowserVisible = action.payload;},
    setContainerTableLoading: (state, action) => {state.containerTableLoading = action.payload;},
  },
});

const getContext = (state) => state.dockerContainer.context;
const getContainer = (state) => state.dockerContainer.container;
const getContainers = (state) => state.dockerContainer.containers;
const getContainerDetailVisible = (state) => state.dockerContainer.containerDetailVisible;
const getContainerLogVisible = (state) => state.dockerContainer.containerLogVisible;
const getContainerTerminalVisible = (state) => state.dockerContainer.containerTerminalVisible;
const getContainerFileBrowserVisible = (state) => state.dockerContainer.containerFileBrowserVisible;
const getContainerTableLoading = (state) => state.dockerContainer.containerTableLoading;

const {setContext} = containerSlice.actions;
const {setContainer} = containerSlice.actions;
const {setContainers} = containerSlice.actions;
const {setContainerDetailVisible} = containerSlice.actions;
const {setContainerLogVisible} = containerSlice.actions;
const {setContainerTerminalVisible} = containerSlice.actions;
const {setContainerFileBrowserVisible} = containerSlice.actions;
const {setContainerTableLoading} = containerSlice.actions;

const store = {
  containerSlice,
  getContext,
  getContainer,
  getContainers,
  getContainerDetailVisible,
  getContainerLogVisible,
  getContainerTerminalVisible,
  getContainerFileBrowserVisible,
  getContainerTableLoading,
  setContext,
  setContainer,
  setContainers,
  setContainerDetailVisible,
  setContainerLogVisible,
  setContainerTerminalVisible,
  setContainerFileBrowserVisible,
  setContainerTableLoading,
};

export default store;
