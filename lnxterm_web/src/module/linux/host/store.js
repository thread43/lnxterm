import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  host: {},
  hosts: [],
  hostDetailVisible: false,
  hostFormAddVisible: false,
  hostFormUpdateVisible: false,
  hostTerminalVisible: false,
  hostFileBrowserVisible: false,
  hostTableLoading: false,
};

const hostSlice = createSlice({
  name: 'linuxHost',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setHost: (state, action) => {state.host = action.payload;},
    setHosts: (state, action) => {state.hosts = action.payload;},
    setHostDetailVisible: (state, action) => {state.hostDetailVisible = action.payload;},
    setHostFormAddVisible: (state, action) => {state.hostFormAddVisible = action.payload;},
    setHostFormUpdateVisible: (state, action) => {state.hostFormUpdateVisible = action.payload;},
    setHostTerminalVisible: (state, action) => {state.hostTerminalVisible = action.payload;},
    setHostFileBrowserVisible: (state, action) => {state.hostFileBrowserVisible = action.payload;},
    setHostTableLoading: (state, action) => {state.hostTableLoading = action.payload;},
  },
});

const getContext = (state) => state.linuxHost.context;
const getHost = (state) => state.linuxHost.host;
const getHosts = (state) => state.linuxHost.hosts;
const getHostDetailVisible = (state) => state.linuxHost.hostDetailVisible;
const getHostFormAddVisible = (state) => state.linuxHost.hostFormAddVisible;
const getHostFormUpdateVisible = (state) => state.linuxHost.hostFormUpdateVisible;
const getHostTerminalVisible = (state) => state.linuxHost.hostTerminalVisible;
const getHostFileBrowserVisible = (state) => state.linuxHost.hostFileBrowserVisible;
const getHostTableLoading = (state) => state.linuxHost.hostTableLoading;

const {setContext} = hostSlice.actions;
const {setHost} = hostSlice.actions;
const {setHosts} = hostSlice.actions;
const {setHostDetailVisible} = hostSlice.actions;
const {setHostFormAddVisible} = hostSlice.actions;
const {setHostFormUpdateVisible} = hostSlice.actions;
const {setHostTerminalVisible} = hostSlice.actions;
const {setHostFileBrowserVisible} = hostSlice.actions;
const {setHostTableLoading} = hostSlice.actions;

const store = {
  hostSlice,
  getContext,
  getHost,
  getHosts,
  getHostDetailVisible,
  getHostFormAddVisible,
  getHostFormUpdateVisible,
  getHostTerminalVisible,
  getHostFileBrowserVisible,
  getHostTableLoading,
  setContext,
  setHost,
  setHosts,
  setHostDetailVisible,
  setHostFormAddVisible,
  setHostFormUpdateVisible,
  setHostTerminalVisible,
  setHostFileBrowserVisible,
  setHostTableLoading,
};

export default store;
