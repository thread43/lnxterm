import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  menu: {},
  menus: [],
  menuDetailVisible: false,
  menuFormAddVisible: false,
  menuFormCopyVisible: false,
  menuFormUpdateVisible: false,
  menuTableLoading: false,
  parentMenus: [],
};

const menuSlice = createSlice({
  name: 'authMenu',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setMenu: (state, action) => {state.menu = action.payload;},
    setMenus: (state, action) => {state.menus = action.payload;},
    setMenuDetailVisible: (state, action) => {state.menuDetailVisible = action.payload;},
    setMenuFormAddVisible: (state, action) => {state.menuFormAddVisible = action.payload;},
    setMenuFormCopyVisible: (state, action) => {state.menuFormCopyVisible = action.payload;},
    setMenuFormUpdateVisible: (state, action) => {state.menuFormUpdateVisible = action.payload;},
    setMenuTableLoading: (state, action) => {state.menuTableLoading = action.payload;},
    setParentMenus: (state, action) => {state.parentMenus = action.payload;},
  },
});

const getContext = (state) => state.authMenu.context;
const getMenu = (state) => state.authMenu.menu;
const getMenus = (state) => state.authMenu.menus;
const getMenuDetailVisible = (state) => state.authMenu.menuDetailVisible;
const getMenuFormAddVisible = (state) => state.authMenu.menuFormAddVisible;
const getMenuFormCopyVisible = (state) => state.authMenu.menuFormCopyVisible;
const getMenuFormUpdateVisible = (state) => state.authMenu.menuFormUpdateVisible;
const getMenuTableLoading = (state) => state.authMenu.menuTableLoading;
const getParentMenus = (state) => state.authMenu.parentMenus;

const {setContext} = menuSlice.actions;
const {setMenu} = menuSlice.actions;
const {setMenus} = menuSlice.actions;
const {setMenuDetailVisible} = menuSlice.actions;
const {setMenuFormAddVisible} = menuSlice.actions;
const {setMenuFormCopyVisible} = menuSlice.actions;
const {setMenuFormUpdateVisible} = menuSlice.actions;
const {setMenuTableLoading} = menuSlice.actions;
const {setParentMenus} = menuSlice.actions;

const store = {
  menuSlice,
  getContext,
  getMenu,
  getMenus,
  getMenuDetailVisible,
  getMenuFormAddVisible,
  getMenuFormCopyVisible,
  getMenuFormUpdateVisible,
  getMenuTableLoading,
  getParentMenus,
  setContext,
  setMenu,
  setMenus,
  setMenuDetailVisible,
  setMenuFormAddVisible,
  setMenuFormCopyVisible,
  setMenuFormUpdateVisible,
  setMenuTableLoading,
  setParentMenus,
};

export default store;
