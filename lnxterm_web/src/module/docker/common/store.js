import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  servers: [],
};

const commonSlice = createSlice({
  name: 'DockerCommon',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setServers: (state, action) => {state.servers = action.payload;},
  },
});

const getContext = (state) => state.dockerCommon.context;
const getServers = (state) => state.dockerCommon.servers;

const {setContext} = commonSlice.actions;
const {setServers} = commonSlice.actions;

const store = {
  commonSlice,
  getContext,
  getServers,
  setContext,
  setServers,
};

export default store;
