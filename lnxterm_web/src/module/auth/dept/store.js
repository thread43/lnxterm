import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  dept: {},
  depts: [],
  deptDetailVisible: false,
  deptFormAddVisible: false,
  deptFormUpdateVisible: false,
  deptTableLoading: false,
};

const deptSlice = createSlice({
  name: 'authDept',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setDept: (state, action) => {state.dept = action.payload;},
    setDepts: (state, action) => {state.depts = action.payload;},
    setDeptDetailVisible: (state, action) => {state.deptDetailVisible = action.payload;},
    setDeptFormAddVisible: (state, action) => {state.deptFormAddVisible = action.payload;},
    setDeptFormUpdateVisible: (state, action) => {state.deptFormUpdateVisible = action.payload;},
    setDeptTableLoading: (state, action) => {state.deptTableLoading = action.payload;},
  },
});

const getContext = (state) => state.authDept.context;
const getDept = (state) => state.authDept.dept;
const getDepts = (state) => state.authDept.depts;
const getDeptDetailVisible = (state) => state.authDept.deptDetailVisible;
const getDeptFormAddVisible = (state) => state.authDept.deptFormAddVisible;
const getDeptFormUpdateVisible = (state) => state.authDept.deptFormUpdateVisible;
const getDeptTableLoading = (state) => state.authDept.deptTableLoading;

const {setContext} = deptSlice.actions;
const {setDept} = deptSlice.actions;
const {setDepts} = deptSlice.actions;
const {setDeptDetailVisible} = deptSlice.actions;
const {setDeptFormAddVisible} = deptSlice.actions;
const {setDeptFormUpdateVisible} = deptSlice.actions;
const {setDeptTableLoading} = deptSlice.actions;

const store = {
  deptSlice,
  getContext,
  getDept,
  getDepts,
  getDeptDetailVisible,
  getDeptFormAddVisible,
  getDeptFormUpdateVisible,
  getDeptTableLoading,
  setContext,
  setDept,
  setDepts,
  setDeptDetailVisible,
  setDeptFormAddVisible,
  setDeptFormUpdateVisible,
  setDeptTableLoading,
};

export default store;
