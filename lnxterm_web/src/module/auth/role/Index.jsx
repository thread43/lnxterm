import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PermList from './PermList.jsx';
import RoleDetail from './RoleDetail.jsx';
import RoleFormAdd from './RoleFormAdd.jsx';
import RoleFormUpdate from './RoleFormUpdate.jsx';
import RoleList from './RoleList.jsx';
import store from './store.js';

function Role() {
  const storeRoleDetailVisible = useSelector(store.getRoleDetailVisible);
  const storeRoleFormAddVisible = useSelector(store.getRoleFormAddVisible);
  const storeRoleFormUpdateVisible = useSelector(store.getRoleFormUpdateVisible);
  const storePermListVisible = useSelector(store.getPermListVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/auth">Auth</Link>},
          {title: 'Role List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <RoleList />
      </Layout.Content>

      {storeRoleDetailVisible === true && <RoleDetail />}
      {storeRoleFormAddVisible === true && <RoleFormAdd />}
      {storeRoleFormUpdateVisible === true && <RoleFormUpdate />}
      {storePermListVisible === true && <PermList />}
    </>
  );
}

export default Role;
