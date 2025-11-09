import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  server: {},
  servers: [],
  serverDetailVisible: false,
  serverFormAddVisible: false,
  serverFormUpdateVisible: false,
  serverTableLoading: false,
};

const serverSlice = createSlice({
  name: 'dockerServer',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setServer: (state, action) => {state.server = action.payload;},
    setServers: (state, action) => {state.servers = action.payload;},
    setServerDetailVisible: (state, action) => {state.serverDetailVisible = action.payload;},
    setServerFormAddVisible: (state, action) => {state.serverFormAddVisible = action.payload;},
    setServerFormUpdateVisible: (state, action) => {state.serverFormUpdateVisible = action.payload;},
    setServerTableLoading: (state, action) => {state.serverTableLoading = action.payload;},
  },
});

const getContext = (state) => state.dockerServer.context;
const getServer = (state) => state.dockerServer.server;
const getServers = (state) => state.dockerServer.servers;
const getServerDetailVisible = (state) => state.dockerServer.serverDetailVisible;
const getServerFormAddVisible = (state) => state.dockerServer.serverFormAddVisible;
const getServerFormUpdateVisible = (state) => state.dockerServer.serverFormUpdateVisible;
const getServerTableLoading = (state) => state.dockerServer.serverTableLoading;

const {setContext} = serverSlice.actions;
const {setServer} = serverSlice.actions;
const {setServers} = serverSlice.actions;
const {setServerDetailVisible} = serverSlice.actions;
const {setServerFormAddVisible} = serverSlice.actions;
const {setServerFormUpdateVisible} = serverSlice.actions;
const {setServerTableLoading} = serverSlice.actions;

const store = {
  serverSlice,
  getContext,
  getServer,
  getServers,
  getServerDetailVisible,
  getServerFormAddVisible,
  getServerFormUpdateVisible,
  getServerTableLoading,
  setContext,
  setServer,
  setServers,
  setServerDetailVisible,
  setServerFormAddVisible,
  setServerFormUpdateVisible,
  setServerTableLoading,
};

export default store;
