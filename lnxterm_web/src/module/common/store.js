import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  siderCollapsed: localStorage.getItem('siderCollapsed') === 'true',
  currentUser: {},
  userFormPasswordVisible: false,
  userFormProfileVisible: false,
  openKeys: [],
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setSiderCollapsed: (state, action) => {state.siderCollapsed = action.payload;},
    setCurrentUser: (state, action) => {state.currentUser = action.payload;},
    setUserFormPasswordVisible: (state, action) => {state.userFormPasswordVisible = action.payload;},
    setUserFormProfileVisible: (state, action) => {state.userFormProfileVisible = action.payload;},
    setOpenKeys: (state, action) => {state.openKeys = action.payload;},
  },
});

const getContext = (state) => state.common.context;
const getSiderCollapsed = (state) => state.common.siderCollapsed;
const getCurrentUser = (state) => state.common.currentUser;
const getUserFormPasswordVisible = (state) => state.common.userFormPasswordVisible;
const getUserFormProfileVisible = (state) => state.common.userFormProfileVisible;
const getOpenKeys = (state) => state.common.openKeys;

const {setContext} = commonSlice.actions;
const {setSiderCollapsed} = commonSlice.actions;
const {setCurrentUser} = commonSlice.actions;
const {setUserFormPasswordVisible} = commonSlice.actions;
const {setUserFormProfileVisible} = commonSlice.actions;
const {setOpenKeys} = commonSlice.actions;

const store = {
  commonSlice,
  getContext,
  getSiderCollapsed,
  getCurrentUser,
  getUserFormPasswordVisible,
  getUserFormProfileVisible,
  getOpenKeys,
  setContext,
  setSiderCollapsed,
  setCurrentUser,
  setUserFormPasswordVisible,
  setUserFormProfileVisible,
  setOpenKeys,
};

export default store;
