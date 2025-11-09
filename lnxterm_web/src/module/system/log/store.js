import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  log: {},
  logs: [],
  logsPagination: {page: 1, size: 10, total: 0},
  logDetailVisible: false,
  logTableLoading: false,
};

const logSlice = createSlice({
  name: 'systemLog',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setLog: (state, action) => {state.log = action.payload;},
    setLogs: (state, action) => {state.logs = action.payload;},
    setLogsPagination: (state, action) => {state.logsPagination = action.payload;},
    setLogDetailVisible: (state, action) => {state.logDetailVisible = action.payload;},
    setLogTableLoading: (state, action) => {state.logTableLoading = action.payload;},
  },
});

const getContext = (state) => state.systemLog.context;
const getLog = (state) => state.systemLog.log;
const getLogs = (state) => state.systemLog.logs;
const getLogsPagination = (state) => state.systemLog.logsPagination;
const getLogDetailVisible = (state) => state.systemLog.logDetailVisible;
const getLogTableLoading = (state) => state.systemLog.logTableLoading;

const {setContext} = logSlice.actions;
const {setLog} = logSlice.actions;
const {setLogs} = logSlice.actions;
const {setLogsPagination} = logSlice.actions;
const {setLogDetailVisible} = logSlice.actions;
const {setLogTableLoading} = logSlice.actions;

const store = {
  logSlice,
  getContext,
  getLog,
  getLogs,
  getLogsPagination,
  getLogDetailVisible,
  getLogTableLoading,
  setContext,
  setLog,
  setLogs,
  setLogsPagination,
  setLogDetailVisible,
  setLogTableLoading,
};

export default store;
