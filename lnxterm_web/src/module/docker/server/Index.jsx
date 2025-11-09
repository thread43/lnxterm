import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ServerDetail from './ServerDetail.jsx';
import ServerFormAdd from './ServerFormAdd.jsx';
import ServerFormUpdate from './ServerFormUpdate.jsx';
import ServerList from './ServerList.jsx';
import store from './store.js';

function Server() {
  const storeServerDetailVisible = useSelector(store.getServerDetailVisible);
  const storeServerFormAddVisible = useSelector(store.getServerFormAddVisible);
  const storeServerFormUpdateVisible = useSelector(store.getServerFormUpdateVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/docker">Docker</Link>},
          {title: 'Server List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <ServerList />
      </Layout.Content>

      {storeServerDetailVisible === true && <ServerDetail />}
      {storeServerFormAddVisible === true && <ServerFormAdd />}
      {storeServerFormUpdateVisible === true && <ServerFormUpdate />}
    </>
  );
}

export default Server;
