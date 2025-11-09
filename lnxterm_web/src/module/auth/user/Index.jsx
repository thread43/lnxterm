import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PermList from './PermList.jsx';
import RoleList from './RoleList.jsx';
import UserDetail from './UserDetail.jsx';
import UserFormAdd from './UserFormAdd.jsx';
import UserFormPassword from './UserFormPassword.jsx';
import UserFormUpdate from './UserFormUpdate.jsx';
import UserList from './UserList.jsx';
import store from './store.js';

function User() {
  const storeUserDetailVisible = useSelector(store.getUserDetailVisible);
  const storeUserFormAddVisible = useSelector(store.getUserFormAddVisible);
  const storeUserFormUpdateVisible = useSelector(store.getUserFormUpdateVisible);
  const storeUserFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);
  const storeRoleListVisible = useSelector(store.getRoleListVisible);
  const storePermListVisible = useSelector(store.getPermListVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/auth">Auth</Link>},
          {title: 'User List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <UserList />
      </Layout.Content>

      {storeUserDetailVisible === true && <UserDetail />}
      {storeUserFormAddVisible === true && <UserFormAdd />}
      {storeUserFormUpdateVisible === true && <UserFormUpdate />}
      {storeUserFormPasswordVisible === true && <UserFormPassword />}
      {storeRoleListVisible === true && <RoleList />}
      {storePermListVisible === true && <PermList />}
    </>
  );
}

export default User;
