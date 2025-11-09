import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PermDetail from './PermDetail.jsx';
import PermFormAdd from './PermFormAdd.jsx';
import PermFormCopy from './PermFormCopy.jsx';
import PermFormUpdate from './PermFormUpdate.jsx';
import PermList from './PermList.jsx';
import store from './store.js';

function Perm() {
  const storePermDetailVisible = useSelector(store.getPermDetailVisible);
  const storePermFormAddVisible = useSelector(store.getPermFormAddVisible);
  const storePermFormUpdateVisible = useSelector(store.getPermFormUpdateVisible);
  const storePermFormCopyVisible = useSelector(store.getPermFormCopyVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/auth">Auth</Link>},
          {title: 'Permission List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <PermList />
      </Layout.Content>

      {storePermDetailVisible === true && <PermDetail />}
      {storePermFormAddVisible === true && <PermFormAdd />}
      {storePermFormUpdateVisible === true && <PermFormUpdate />}
      {storePermFormCopyVisible === true && <PermFormCopy />}
    </>
  );
}

export default Perm;
