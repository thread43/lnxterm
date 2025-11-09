import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';
import externalLinkIcon from '/src/static/external-link.svg';
import folderIcon from '/src/static/folder-open.svg';
import terminalIcon from '/src/static/terminal-box-fill.svg';

function ContainerList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreServers = useSelector(commonStore.getServers);
  const storeContainers = useSelector(store.getContainers);
  const storeContainerTableLoading = useSelector(store.getContainerTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {server_id} = context;

    form.resetFields();

    try {
      dispatch(store.setContainerTableLoading(true));

      const response = await api.get_servers();
      dispatch(commonStore.setServers(response.data.data));

      const servers = response.data.data;
      if (servers.length === 0) {
        message.info('Server not found');
        return;
      }

      if (server_id === undefined) {
        server_id = servers[0].id;
        dispatch(commonStore.setContext({server_id}));
      }

      form.setFieldsValue({server_id});

      const response2 = await api.get_containers(server_id);
      if (response2.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response2.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  async function changeServer(value) {
    const server_id = value;

    dispatch(commonStore.setContext({server_id}));
    dispatch(store.setContainers([]));

    try {
      dispatch(store.setContainerTableLoading(true));
      const response = await api.get_containers(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  function getContainer(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerDetailVisible(true));
  }

  function getContainerLog(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerLogVisible(true));
  }

  function openContainerTerminal(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerTerminalVisible(true));
  }

  function openContainerFileBrowser(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerFileBrowserVisible(true));
  }

  function openContainerTerminalExt(container) {
    const server_id = commonStoreContext.server_id;
    const container_id = container.container_id;
    const container_name = container.name;

    let url = '/#/docker/container/terminal';
    url = url + '?server_id=' + server_id;
    url = url + '&container_id=' + container_id;
    url = url + '&container_name=' + container_name;
    console.log(url);

    window.open(url, '_blank');
  }

  function refresh() {
    search();
  }

  function reset() {
    const context = {};
    dispatch(commonStore.setContext({}));
    init(context);
  }

  async function search() {
    const form_value = form.getFieldsValue();
    const server_id = form_value.server_id;

    try {
      dispatch(store.setContainerTableLoading(true));
      const response = await api.get_containers(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'container_id',
      title: 'Container ID',
      dataIndex: 'container_id',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getContainer(record)}>{text}</Button>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'image',
      title: 'Image',
      dataIndex: 'image',
    },
    {
      key: 'command',
      title: 'Command',
      dataIndex: 'command',
    },
    {
      key: 'created',
      title: 'Created At',
      dataIndex: 'created',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
    },
    {
      key: 'state',
      title: 'State',
      dataIndex: 'state',
      render: (text) => {
        if (text === 'running') {
          return (<span><Tag color="success" bordered={false}>{text}</Tag></span>);
        } else {
          return (<span><Tag bordered={false}>{text}</Tag></span>);
        }
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'containers',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div>
            <Button type="link" className="ButtonLink" onClick={() => getContainerLog(record)}>Log</Button>
            <Divider type="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerTerminal(record);}}>
              <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
            <Divider type="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerFileBrowser(record);}}>
              <img src={folderIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
            <Divider type="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerTerminalExt(record);}}>
              <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="server_id" label="Server" style={{marginTop: '2px'}}>
            <Select
              allowClear={false}
              style={{width: 200}}
              onChange={(value) => changeServer(value)}
              options={commonStoreServers.map((item) => (
                {value: item.id, label: item.name}
              ))}
            />
          </Form.Item>
          <Form.Item style={{marginTop: '2px'}}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => search()}>Search</Button>
              <Button type="primary" icon={<UndoOutlined />} onClick={() => reset()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="MyContentDivider"></div>

      <div className="MyContentBlock">
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">Container List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeContainers}
          loading={storeContainerTableLoading}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
          pagination={{
            showSizeChanger: true,
            pageSize: 50,
            position: ['bottomRight'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </>
  );
}

export default ContainerList;
