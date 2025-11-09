import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  perm: {},
  perms: [],
  permDetailVisible: false,
  permFormAddVisible: false,
  permFormUpdateVisible: false,
  permFormCopyVisible: false,
  permTableLoading: false,
  menus: [],
};

const permSlice = createSlice({
  name: 'authPerm',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setPerm: (state, action) => {state.perm = action.payload;},
    setPerms: (state, action) => {state.perms = action.payload;},
    setPermDetailVisible: (state, action) => {state.permDetailVisible = action.payload;},
    setPermFormAddVisible: (state, action) => {state.permFormAddVisible = action.payload;},
    setPermFormUpdateVisible: (state, action) => {state.permFormUpdateVisible = action.payload;},
    setPermFormCopyVisible: (state, action) => {state.permFormCopyVisible = action.payload;},
    setPermTableLoading: (state, action) => {state.permTableLoading = action.payload;},
    setMenus: (state, action) => {state.menus = action.payload;},
  },
});

const getContext = (state) => state.authPerm.context;
const getPerm = (state) => state.authPerm.perm;
const getPerms = (state) => state.authPerm.perms;
const getPermDetailVisible = (state) => state.authPerm.permDetailVisible;
const getPermFormAddVisible = (state) => state.authPerm.permFormAddVisible;
const getPermFormUpdateVisible = (state) => state.authPerm.permFormUpdateVisible;
const getPermFormCopyVisible = (state) => state.authPerm.permFormCopyVisible;
const getPermTableLoading = (state) => state.authPerm.permTableLoading;
const getMenus = (state) => state.authPerm.menus;

const {setContext} = permSlice.actions;
const {setPerm} = permSlice.actions;
const {setPerms} = permSlice.actions;
const {setPermDetailVisible} = permSlice.actions;
const {setPermFormAddVisible} = permSlice.actions;
const {setPermFormUpdateVisible} = permSlice.actions;
const {setPermFormCopyVisible} = permSlice.actions;
const {setPermTableLoading} = permSlice.actions;
const {setMenus} = permSlice.actions;

const store = {
  permSlice,
  getContext,
  getPerm,
  getPerms,
  getPermDetailVisible,
  getPermFormAddVisible,
  getPermFormUpdateVisible,
  getPermFormCopyVisible,
  getPermTableLoading,
  getMenus,
  setContext,
  setPerm,
  setPerms,
  setPermDetailVisible,
  setPermFormAddVisible,
  setPermFormUpdateVisible,
  setPermFormCopyVisible,
  setPermTableLoading,
  setMenus,
};

export default store;
