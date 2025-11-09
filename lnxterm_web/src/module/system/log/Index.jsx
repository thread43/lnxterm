import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import LogDetail from './LogDetail.jsx';
import LogList from './LogList.jsx';
import store from './store.js';

function Log() {
  const storeLogDetailVisible = useSelector(store.getLogDetailVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/system">System</Link>},
          {title: 'Log List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <LogList />
      </Layout.Content>

      {storeLogDetailVisible === true && <LogDetail />}
    </>
  );
}

export default Log;
