import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  role: {},
  roles: [],
  roleDetailVisible: false,
  roleFormAddVisible: false,
  roleFormUpdateVisible: false,
  roleTableLoading: false,
  perms: [],
  permsExtra: {},
  permListVisible: false,
};

const roleSlice = createSlice({
  name: 'authRole',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setRole: (state, action) => {state.role = action.payload;},
    setRoles: (state, action) => {state.roles = action.payload;},
    setRoleDetailVisible: (state, action) => {state.roleDetailVisible = action.payload;},
    setRoleFormAddVisible: (state, action) => {state.roleFormAddVisible = action.payload;},
    setRoleFormUpdateVisible: (state, action) => {state.roleFormUpdateVisible = action.payload;},
    setRoleTableLoading: (state, action) => {state.roleTableLoading = action.payload;},
    setPerms: (state, action) => {state.perms = action.payload;},
    setPermsExtra: (state, action) => {state.permsExtra = action.payload;},
    setPermListVisible: (state, action) => {state.permListVisible = action.payload;},
  },
});

const getContext = (state) => state.authRole.context;
const getRole = (state) => state.authRole.role;
const getRoles = (state) => state.authRole.roles;
const getRoleDetailVisible = (state) => state.authRole.roleDetailVisible;
const getRoleFormAddVisible = (state) => state.authRole.roleFormAddVisible;
const getRoleFormUpdateVisible = (state) => state.authRole.roleFormUpdateVisible;
const getRoleTableLoading = (state) => state.authRole.roleTableLoading;
const getPerms = (state) => state.authRole.perms;
const getPermsExtra = (state) => state.authRole.permsExtra;
const getPermListVisible = (state) => state.authRole.permListVisible;

const {setContext} = roleSlice.actions;
const {setRole} = roleSlice.actions;
const {setRoles} = roleSlice.actions;
const {setRoleDetailVisible} = roleSlice.actions;
const {setRoleFormAddVisible} = roleSlice.actions;
const {setRoleFormUpdateVisible} = roleSlice.actions;
const {setRoleTableLoading} = roleSlice.actions;
const {setPerms} = roleSlice.actions;
const {setPermsExtra} = roleSlice.actions;
const {setPermListVisible} = roleSlice.actions;

const store = {
  roleSlice,
  getContext,
  getRole,
  getRoles,
  getRoleDetailVisible,
  getRoleFormAddVisible,
  getRoleFormUpdateVisible,
  getRoleTableLoading,
  getPerms,
  getPermsExtra,
  getPermListVisible,
  setContext,
  setRole,
  setRoles,
  setRoleDetailVisible,
  setRoleFormAddVisible,
  setRoleFormUpdateVisible,
  setRoleTableLoading,
  setPerms,
  setPermsExtra,
  setPermListVisible,
};

export default store;
