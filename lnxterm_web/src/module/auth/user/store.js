import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  user: {},
  users: [],
  userDetailVisible: false,
  userFormAddVisible: false,
  userFormUpdateVisible: false,
  userFormPasswordVisible: false,
  userTableLoading: false,
  depts: [],
  roles: [],
  rolesExtra: {},
  roleListVisible: false,
  perms: [],
  permsExtra: {},
  permListVisible: false,
};

const userSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setUser: (state, action) => {state.user = action.payload;},
    setUsers: (state, action) => {state.users = action.payload;},
    setUserDetailVisible: (state, action) => {state.userDetailVisible = action.payload;},
    setUserFormAddVisible: (state, action) => {state.userFormAddVisible = action.payload;},
    setUserFormUpdateVisible: (state, action) => {state.userFormUpdateVisible = action.payload;},
    setUserFormPasswordVisible: (state, action) => {state.userFormPasswordVisible = action.payload;},
    setUserTableLoading: (state, action) => {state.userTableLoading = action.payload;},
    setDepts: (state, action) => {state.depts = action.payload;},
    setRoles: (state, action) => {state.roles = action.payload;},
    setRolesExtra: (state, action) => {state.rolesExtra = action.payload;},
    setRoleListVisible: (state, action) => {state.roleListVisible = action.payload;},
    setPerms: (state, action) => {state.perms = action.payload;},
    setPermsExtra: (state, action) => {state.permsExtra = action.payload;},
    setPermListVisible: (state, action) => {state.permListVisible = action.payload;},
  },
});

const getContext = (state) => state.authUser.context;
const getUser = (state) => state.authUser.user;
const getUsers = (state) => state.authUser.users;
const getUserDetailVisible = (state) => state.authUser.userDetailVisible;
const getUserFormAddVisible = (state) => state.authUser.userFormAddVisible;
const getUserFormUpdateVisible = (state) => state.authUser.userFormUpdateVisible;
const getUserFormPasswordVisible = (state) => state.authUser.userFormPasswordVisible;
const getUserTableLoading = (state) => state.authUser.userTableLoading;
const getDepts = (state) => state.authUser.depts;
const getRoles = (state) => state.authUser.roles;
const getRolesExtra = (state) => state.authUser.rolesExtra;
const getRoleListVisible = (state) => state.authUser.roleListVisible;
const getPerms = (state) => state.authUser.perms;
const getPermsExtra = (state) => state.authUser.permsExtra;
const getPermListVisible = (state) => state.authUser.permListVisible;

const {setContext} = userSlice.actions;
const {setUser} = userSlice.actions;
const {setUsers} = userSlice.actions;
const {setUserDetailVisible} = userSlice.actions;
const {setUserFormAddVisible} = userSlice.actions;
const {setUserFormUpdateVisible} = userSlice.actions;
const {setUserFormPasswordVisible} = userSlice.actions;
const {setUserTableLoading} = userSlice.actions;
const {setDepts} = userSlice.actions;
const {setRoles} = userSlice.actions;
const {setRolesExtra} = userSlice.actions;
const {setRoleListVisible} = userSlice.actions;
const {setPerms} = userSlice.actions;
const {setPermsExtra} = userSlice.actions;
const {setPermListVisible} = userSlice.actions;

const store = {
  userSlice,
  getContext,
  getUser,
  getUsers,
  getUserDetailVisible,
  getUserFormAddVisible,
  getUserFormUpdateVisible,
  getUserFormPasswordVisible,
  getUserTableLoading,
  getRoles,
  getRolesExtra,
  getRoleListVisible,
  getPerms,
  getPermsExtra,
  getPermListVisible,
  getDepts,
  setContext,
  setUser,
  setUsers,
  setUserDetailVisible,
  setUserFormAddVisible,
  setUserFormUpdateVisible,
  setUserFormPasswordVisible,
  setUserTableLoading,
  setDepts,
  setRoles,
  setRolesExtra,
  setRoleListVisible,
  setPerms,
  setPermsExtra,
  setPermListVisible,
};

export default store;
