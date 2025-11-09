import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';
import {useLocation} from 'react-router';
import {App} from 'antd';
import {Layout} from 'antd';
import {Menu} from 'antd';
import {Space} from 'antd';
import api from './api.js';
import store from './store.js';
import styles from './MySider.module.css';
import logo from '/src/static/react/logo_dark.svg';
import routes from '../../util/routes.jsx';

function MySider() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeSiderCollapsed = useSelector(store.getSiderCollapsed);
  const storeOpenKeys = useSelector(store.getOpenKeys);

  const reactRouterLocation = useLocation();

  const [stateMenus, setStateMenus] = useState([]);
  const [stateSelectedKeys, setStateSelectedKeys] = useState([]);

  const menuLink = {};
  for (const route of routes) {
      menuLink[route.alias] = route.path;
  }
  const menuIcon = {};
  for (const route of routes) {
      menuIcon[route.alias] = route.icon;
  }

  useEffect(() => {
    const path = reactRouterLocation.pathname;
    const fields = path.split('/');
    const fields2 = fields.filter(item => item !== '');

    const selectedKey = fields2.join('_');
    setStateSelectedKeys([selectedKey]);

    if (storeSiderCollapsed === false) {
      if (fields2.length > 0) {
        const openKey = fields2[0];
        dispatch(store.setOpenKeys([openKey]));
      }
    }

    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getMenus() {
    try {
      const response = await api.get_menus();
      setStateMenus(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function onBreakpoint(broken) {
    console.log(broken);
    if (broken === true) {
      dispatch(store.setSiderCollapsed(true));
    } else {
      if (localStorage.getItem('siderCollapsed') !== 'true') {
        dispatch(store.setSiderCollapsed(false));
        localStorage.setItem('siderCollapsed', false);
        const path = reactRouterLocation.pathname;
        const fields = path.split('/')
        const fields2 = fields.filter(item => item !== '');
        if (fields2.length > 0) {
          const openKey = fields2[0];
          dispatch(store.setOpenKeys([openKey]));
        }
      }
    }
  }

  function onCollapse(collapsed, type) {
    console.log(collapsed, type);
  }

  // {xs: '480px', sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1600px'}
  // https://ant.design/components/layout#layoutsider
  // https://ant.design/components/layout#breakpoint-width

  return (
    <>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={storeSiderCollapsed}
        collapsedWidth="48px"
        width="208px"
        theme="dark"
        className={styles.MySider}
        breakpoint="md"
        // collapsedWidth="0"
        onBreakpoint={(broken) => onBreakpoint(broken)}
        onCollapse={(collapsed, type) => onCollapse(collapsed, type)}
      >
        <div className={styles.SiteInfo}>
          <Link to="/">
            <Space>
              <img src={logo} alt="" className={styles.SiteLogo} />
              {storeSiderCollapsed === false && <span className={styles.SiteTitle}>LNXTERM</span>}
            </Space>
          </Link>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          openKeys={storeOpenKeys}
          selectedKeys={stateSelectedKeys}
          items={stateMenus.map((menu) => ({
            key: menu.code,
            label: menu.name,
            icon: menuIcon[menu.code],
            children: menu.children.map((menu2) => (
              {key: menu2.code, label: <Link to={menuLink[menu2.code]}>{menu2.name}</Link>})
            ),
          }))}
          onOpenChange={(keys) => dispatch(store.setOpenKeys(keys))}
          onClick={(event) => setStateSelectedKeys([event.key])}
        >
        </Menu>
      </Layout.Sider>
    </>
  );
}

export default MySider;
