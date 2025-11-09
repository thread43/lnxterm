import {Route} from 'react-router';
import {Routes} from 'react-router';
import {App as AntdApp} from 'antd';
import {ConfigProvider} from 'antd';
import {Modal} from 'antd';
import Login from './module/common/Login.jsx';
import MyLayout from './module/common/MyLayout.jsx';
import PodTerminalExt from './module/k8s/pod/PodTerminalExt.jsx';
import ContainerTerminalExt from './module/docker/container/ContainerTerminalExt.jsx';
import HostTerminalExt from './module/linux/host/HostTerminalExt.jsx';
import Test from './module/test/Test.jsx';
import TestLayout from './module/test/TestLayout.jsx';
import history from './util/history.js';
import 'antd/dist/reset.css';
import './App.css';

// https://ant.design/components/modal/#Modal.method()
history.listen(() => {
  console.log('route changed');
  Modal.destroyAll();
});

function App() {
  return (
    <>
      <ConfigProvider theme={{token: {motion: false}}}>
        <AntdApp>
          <Routes>
            <Route path="/*" element={<MyLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/linux/host/terminal" element={<HostTerminalExt />} />
            <Route path="/docker/container/terminal" element={<ContainerTerminalExt />} />
            <Route path="/k8s/pod/terminal" element={<PodTerminalExt />} />
            <Route path="/test" element={<Test />} />
            <Route path="/testlayout" element={<TestLayout />} />
          </Routes>
        </AntdApp>
      </ConfigProvider>
    </>
  );
}

export default App;
