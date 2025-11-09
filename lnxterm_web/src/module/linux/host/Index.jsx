import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import HostDetail from './HostDetail.jsx';
import HostFileBrowser from './HostFileBrowser.jsx';
import HostFormAdd from './HostFormAdd.jsx';
import HostFormUpdate from './HostFormUpdate.jsx';
import HostList from './HostList.jsx';
import HostTerminal from './HostTerminal.jsx';
import store from './store.js';

function Host() {
  const storeHostDetailVisible = useSelector(store.getHostDetailVisible);
  const storeHostFileBrowserVisible = useSelector(store.getHostFileBrowserVisible);
  const storeHostFormAddVisible = useSelector(store.getHostFormAddVisible);
  const storeHostFormUpdateVisible = useSelector(store.getHostFormUpdateVisible);
  const storeHostTerminalVisible = useSelector(store.getHostTerminalVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/linux">Linux</Link>},
          {title: 'Host List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <HostList />
      </Layout.Content>

      {storeHostDetailVisible === true && <HostDetail />}
      {storeHostFileBrowserVisible === true && <HostFileBrowser />}
      {storeHostFormAddVisible === true && <HostFormAdd />}
      {storeHostFormUpdateVisible === true && <HostFormUpdate />}
      {storeHostTerminalVisible === true && <HostTerminal />}
    </>
  );
}

export default Host;
