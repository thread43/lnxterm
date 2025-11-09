import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ContainerDetail from './ContainerDetail.jsx';
import ContainerFileBrowser from './ContainerFileBrowser.jsx';
import ContainerList from './ContainerList.jsx';
import ContainerLog from './ContainerLog.jsx';
import ContainerTerminal from './ContainerTerminal.jsx';
import store from './store.js';

function Container() {
  const storeContainerDetailVisible = useSelector(store.getContainerDetailVisible);
  const storeContainerLogVisible = useSelector(store.getContainerLogVisible);
  const storeContainerTerminalVisible = useSelector(store.getContainerTerminalVisible);
  const storeContainerFileBrowserVisible = useSelector(store.getContainerFileBrowserVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/docker">Docker</Link>},
          {title: 'Container List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ContainerList />
      </Layout.Content>

      {storeContainerDetailVisible === true && <ContainerDetail />}
      {storeContainerLogVisible === true && <ContainerLog />}
      {storeContainerTerminalVisible === true && <ContainerTerminal />}
      {storeContainerFileBrowserVisible === true && <ContainerFileBrowser />}
    </>
  );
}

export default Container;
