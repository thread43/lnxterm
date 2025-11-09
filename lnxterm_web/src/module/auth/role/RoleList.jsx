import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function RoleList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeRoles = useSelector(store.getRoles);
  const storeRoleTableLoading = useSelector(store.getRoleTableLoading);

  useEffect(() => {
    getRoles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addRole() {
    dispatch(store.setRole({}));
    dispatch(store.setRoleFormAddVisible(true));
  }

  async function deleteRole(id) {
    try {
      await api.delete_role(id);
      message.success('Request succeeded', 1);

      dispatch(store.setRoleTableLoading(true));
      const response = await api.get_roles();
      dispatch(store.setRoles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setRoleTableLoading(false));
    }
  }

  function getRole(id) {
    dispatch(store.setRole({id}));
    dispatch(store.setRoleDetailVisible(true));
  }

  async function getRoles() {
    try {
      dispatch(store.setRoleTableLoading(true));
      const response = await api.get_roles();
      dispatch(store.setRoles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setRoleTableLoading(false));
    }
  }

  function updateRole(id) {
    dispatch(store.setRole({id}));
    dispatch(store.setRoleFormUpdateVisible(true));
  }

  function grantPerm(role_id) {
    dispatch(store.setRole({id: role_id}));
    dispatch(store.setPermListVisible(true));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getRole(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'actions',
      title: () => (
        <span>
          Actions
          &nbsp;
          <Tooltip title={<>Grant: Grant Permissions</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateRole(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteRole(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => grantPerm(record.id)}>Grant</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Role List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addRole()}>New Role</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getRoles()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeRoles}
        loading={storeRoleTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default RoleList;
