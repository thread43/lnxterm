import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Dropdown} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Switch} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {Tooltip} from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import {CloseOutlined} from '@ant-design/icons';
import {MoreOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function UserList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storeUsers = useSelector(store.getUsers);
  const storeUserTableLoading = useSelector(store.getUserTableLoading);

  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addUser() {
    dispatch(store.setUserFormAddVisible(true));
  }

  async function deleteUser(id) {
    try {
      await api.delete_user(id);
      message.success('Request succeeded', 1);

      dispatch(store.setUserTableLoading(true));
      const response = await api.get_users();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  }

  function getUser(id) {
    dispatch(store.setUser({id}));
    dispatch(store.setUserDetailVisible(true));
  }

  async function getUsers() {
    try {
      dispatch(store.setUserTableLoading(true));
      const response = await api.get_users();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  }

  function updateUser(id) {
    dispatch(store.setUser({id}));
    dispatch(store.setUserFormUpdateVisible(true));
  }

  async function enableOrDisableUser(id) {
    try {
      if (storeUser.is_active === 0) {
        await api.enable_user(id);
      } else {
        await api.disable_user(id);
      }

      dispatch(store.setUserTableLoading(true));
      const response = await api.get_users();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  }

  function resetPassword(user_id) {
    dispatch(store.setUser({id: user_id}));
    dispatch(store.setUserFormPasswordVisible(true));
  }

  function assignRole(user_id) {
    dispatch(store.setUser({id: user_id}));
    dispatch(store.setRoleListVisible(true));
  }

  function grantPerm(user_id) {
    dispatch(store.setUser({id: user_id}));
    dispatch(store.setPermListVisible(true));
  }

  const columns = [
    {
      key: 'username',
      title: 'Username',
      dataIndex: 'username',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getUser(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'nickname',
      title: 'Nickname',
      dataIndex: 'nickname',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'is_admin',
      title: 'Is Admin',
      dataIndex: 'is_admin',
      render: (text) => (text === 1) ? (<span><CheckOutlined /></span>) : (<span><CloseOutlined /></span>),
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'dept_name',
    },
    {
      key: 'roles',
      title: 'Roles',
      dataIndex: 'role_names',
      render: (text) => (
        <>
          {text !== null && text.map((item, index) => (
            <div key={index}>
              <Tag bordered={true}>{item}</Tag>
            </div>
          ))}
        </>
      ),
    },
    {
      key: 'is_active',
      title: 'Is Active',
      dataIndex: 'is_active',
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => enableOrDisableUser(record.id)}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
          <span>
            <Switch
              size="small"
              checked={(text === 1)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onClick={() => dispatch(store.setUser(record))}
           />
         </span>
        </Popconfirm>
      ),
    },
    {
      key: 'actions',
      title: () => (
        <span>
          Actions
          &nbsp;
          <Tooltip title={<>Assign: Assign Roles<br />Grant: Grant Permissions</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      fixed: 'right',
      render: (text, record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateUser(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => assignRole(record.id)}>Assign</Button>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => grantPerm(record.id)}>Grant</Button>
          <Divider type="vertical" />
          <Dropdown
            menu={{
              items: [{key: '0', label: 'Reset Password', className: 'MenuItemLink'}],
              onClick: () => resetPassword(record.id),
            }}
          >
            <Button type="link" className="ButtonLink" icon={<MoreOutlined />} />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">User List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addUser()}>New User</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getUsers()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeUsers}
        loading={storeUserTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default UserList;
