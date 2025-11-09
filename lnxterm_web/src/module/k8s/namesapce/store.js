import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  namespace: {},
  namespaces: [],
  namespaceDetailVisible: false,
  namespaceLogVisible: false,
  namespaceYamlVisible: false,
  namespaceTableLoading: false,
};

const namespaceSlice = createSlice({
  name: 'k8sNamespace',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setNamespace: (state, action) => {state.namespace = action.payload;},
    setNamespaces: (state, action) => {state.namespaces = action.payload;},
    setNamespaceDetailVisible: (state, action) => {state.namespaceDetailVisible = action.payload;},
    setNamespaceLogVisible: (state, action) => {state.namespaceLogVisible = action.payload;},
    setNamespaceYamlVisible: (state, action) => {state.namespaceYamlVisible = action.payload;},
    setNamespaceTableLoading: (state, action) => {state.namespaceTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sNamespace.context;
const getNamespace = (state) => state.k8sNamespace.namespace;
const getNamespaces = (state) => state.k8sNamespace.namespaces;
const getNamespaceDetailVisible = (state) => state.k8sNamespace.namespaceDetailVisible;
const getNamespaceLogVisible = (state) => state.k8sNamespace.namespaceLogVisible;
const getNamespaceYamlVisible = (state) => state.k8sNamespace.namespaceYamlVisible;
const getNamespaceTableLoading = (state) => state.k8sNamespace.namespaceTableLoading;

const {setContext} = namespaceSlice.actions;
const {setNamespace} = namespaceSlice.actions;
const {setNamespaces} = namespaceSlice.actions;
const {setNamespaceDetailVisible} = namespaceSlice.actions;
const {setNamespaceLogVisible} = namespaceSlice.actions;
const {setNamespaceYamlVisible} = namespaceSlice.actions;
const {setNamespaceTableLoading} = namespaceSlice.actions;

const store = {
  namespaceSlice,
  getContext,
  getNamespace,
  getNamespaces,
  getNamespaceDetailVisible,
  getNamespaceLogVisible,
  getNamespaceYamlVisible,
  getNamespaceTableLoading,
  setContext,
  setNamespace,
  setNamespaces,
  setNamespaceDetailVisible,
  setNamespaceLogVisible,
  setNamespaceYamlVisible,
  setNamespaceTableLoading,
};

export default store;
