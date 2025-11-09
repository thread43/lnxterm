import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import MenuDetail from './MenuDetail.jsx';
import MenuFormAdd from './MenuFormAdd.jsx';
import MenuFormCopy from './MenuFormCopy.jsx';
import MenuFormUpdate from './MenuFormUpdate.jsx';
import MenuList from './MenuList.jsx';
import store from './store.js';

function Menu() {
  const storeMenuDetailVisible = useSelector(store.getMenuDetailVisible);
  const storeMenuFormAddVisible = useSelector(store.getMenuFormAddVisible);
  const storeMenuFormCopyVisible = useSelector(store.getMenuFormCopyVisible);
  const storeMenuFormUpdateVisible = useSelector(store.getMenuFormUpdateVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/auth">Auth</Link>},
          {title: 'Menu List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <MenuList />
      </Layout.Content>

      {storeMenuDetailVisible === true && <MenuDetail />}
      {storeMenuFormAddVisible === true && <MenuFormAdd />}
      {storeMenuFormCopyVisible === true && <MenuFormCopy />}
      {storeMenuFormUpdateVisible === true && <MenuFormUpdate />}
    </>
  );
}

export default Menu;
