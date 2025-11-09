import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {ExportOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function ServerList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServers = useSelector(store.getServers);
  const storeServerTableLoading = useSelector(store.getServerTableLoading);

  useEffect(() => {
    getServers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addServer() {
    dispatch(store.setServer({}));
    dispatch(store.setServerFormAddVisible(true));
  }

  async function deleteServer(id) {
    try {
      await api.delete_server(id);
      message.success('Request succeeded', 1);

      dispatch(store.setServerTableLoading(true));
      const response = await api.get_servers();
      dispatch(store.setServers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setServerTableLoading(false));
    }
  }

  function getServer(id) {
    dispatch(store.setServer({id}));
    dispatch(store.setServerDetailVisible(true));
  }

  async function getServers() {
    try {
      dispatch(store.setServerTableLoading(true));
      const response = await api.get_servers();
      dispatch(store.setServers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setServerTableLoading(false));
    }
  }

  function updateServer(id) {
    dispatch(store.setServer({id}));
    dispatch(store.setServerFormUpdateVisible(true));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getServer(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'host',
      title: 'Host',
      dataIndex: 'host',
    },
    {
      key: 'version',
      title: 'Version',
      dataIndex: 'version',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateServer(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteServer(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Server List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addServer()}>New Server</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getServers()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeServers}
        loading={storeServerTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default ServerList;
