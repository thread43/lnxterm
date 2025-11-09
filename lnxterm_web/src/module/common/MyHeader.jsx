import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {useNavigate} from 'react-router';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Dropdown} from 'antd';
import {Layout} from 'antd';
import {Space} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import {LockOutlined} from '@ant-design/icons';
import {LogoutOutlined} from '@ant-design/icons';
import {MenuFoldOutlined} from '@ant-design/icons';
import {MenuUnfoldOutlined} from '@ant-design/icons';
import {UserOutlined} from '@ant-design/icons';
import UserFormPassword from './UserFormPassword.jsx';
import UserFormProfile from './UserFormProfile.jsx';
import api from './api.js';
import store from './store.js';
import styles from './MyHeader.module.css';

function MyHeader() {
  const {message} = App.useApp();

  const navigate = useNavigate();
  const reactRouterLocation = useLocation();

  const dispatch = useDispatch();
  const storeSiderCollapsed = useSelector(store.getSiderCollapsed);
  const storeCurrentUser = useSelector(store.getCurrentUser);
  const storeUserFormProfileVisible = useSelector(store.getUserFormProfileVisible);
  const storeUserFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function changePassword() {
    try {
      dispatch(store.setUserFormPasswordVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  async function getCurrentUser() {
    try {
      const response = await api.get_current_user();
      dispatch(store.setCurrentUser(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  async function logout() {
    try {
      await api.logout();
      dispatch(store.setCurrentUser({}));
      dispatch(store.setOpenKeys([]));
      navigate('/login');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function toggleSider() {
    dispatch(store.setSiderCollapsed(!storeSiderCollapsed));
    localStorage.setItem('siderCollapsed', !storeSiderCollapsed);

    const siderCollapsed = !storeSiderCollapsed;
    if (siderCollapsed === false) {
      const path = reactRouterLocation.pathname;
      const fields = path.split('/')
      const fields2 = fields.filter(item => item !== '');
      if (fields2.length > 0) {
        const openKey = fields2[0];
        dispatch(store.setOpenKeys([openKey]));
      }
    }
  }

  async function updateProfile() {
    try {
      const response = await api.get_current_user();
      dispatch(store.setCurrentUser(response.data.data));
      dispatch(store.setUserFormProfileVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  return (
    <>
      <Layout.Header className={styles.MyHeader}>
        <div className={styles.MyTrigger}>
          <Button
            type="link"
            onClick={() => toggleSider()}
            style={{color: 'inherit', height: '48px', fontSize: '18px'}}
          >
            {storeSiderCollapsed === false ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>
        </div>

        <div className={styles.MyRight}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit_profile',
                  label: 'Edit Profile',
                  icon: <EditOutlined />,
                  onClick: () => updateProfile(),
                },
                {
                  key: 'change_password',
                  label: 'Change Password',
                  icon: <LockOutlined />,
                  onClick: () => changePassword(),
                },
                {
                  type: 'divider'
                },
                {
                  key: 'logout',
                  label: 'Log Out',
                  icon: <LogoutOutlined />,
                  onClick: () => logout(),
                },
              ],
            }}
            placement="bottomRight"
            className={styles.MyAction}
          >
            <Space>
              <UserOutlined />
              {storeCurrentUser.nickname}
            </Space>
          </Dropdown>
        </div>
      </Layout.Header>

      {storeUserFormProfileVisible === true && <UserFormProfile />}
      {storeUserFormPasswordVisible === true && <UserFormPassword />}
    </>
  );
}

export default MyHeader;
