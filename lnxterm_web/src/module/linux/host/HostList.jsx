import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';
import externalLinkIcon from '/src/static/external-link.svg';
import folderIcon from '/src/static/folder-open.svg';
import terminalIcon from '/src/static/terminal-box-fill.svg';

function HostList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeHosts = useSelector(store.getHosts);
  const storeHostTableLoading = useSelector(store.getHostTableLoading);

  useEffect(() => {
    getHosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addHost() {
    dispatch(store.setHost({}));
    dispatch(store.setHostFormAddVisible(true));
  }

  async function deleteHost(id) {
    try {
      await api.delete_host(id);
      message.success('Request succeeded', 1);

      dispatch(store.setHostTableLoading(true));
      const response = await api.get_hosts();
      dispatch(store.setHosts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setHostTableLoading(false));
    }
  }

  function getHost(id) {
    dispatch(store.setHost({id}));
    dispatch(store.setHostDetailVisible(true));
  }

  async function getHosts() {
    try {
      dispatch(store.setHostTableLoading(true));
      const response = await api.get_hosts();
      dispatch(store.setHosts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setHostTableLoading(false));
    }
  }

  function updateHost(id) {
    dispatch(store.setHost({id}));
    dispatch(store.setHostFormUpdateVisible(true));
  }

  function openHostTerminal(host) {
    dispatch(store.setHost(host));
    dispatch(store.setHostTerminalVisible(true));
  }

  function openHostFileBrowser(id, ssh_host) {
    dispatch(store.setHost({id, ssh_host}));
    dispatch(store.setHostFileBrowserVisible(true));
  }

  function openHostTerminalExt(host) {
    const host_id = host.id;
    const ssh_host = host.ssh_host;
    const ssh_port = host.ssh_host;
    const ssh_user = host.ssh_user;

    let url = '/#/linux/host/terminal';
    url = url + '?host_id=' + host_id;
    url = url + '&ssh_host=' + ssh_host;
    url = url + '&ssh_port=' + ssh_port;
    url = url + '&ssh_user=' + ssh_user;
    console.log(url);

    window.open(url, '_blank');
  }

  const columns = [
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
      fixed: 'left',
      sorter: (x, y) => x.ip.localeCompare(y.ip),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getHost(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'ssh',
      title: 'SSH',
      dataIndex: 'ssh',
      render: (text, record) => {
        if (record.ssh_host !== '') {
          if (record.ssh_private_key !== '') {
            return (
              <span>
                <Tag>
                  ssh {record.ssh_user}@{record.ssh_host}:{record.ssh_port} -i {record.ssh_private_key}
                </Tag>
              </span>
            );
          } else {
            return (
              <span>
                <Tag>
                  ssh {record.ssh_user}@{record.ssh_host}:{record.ssh_port} -p
                </Tag>
              </span>
            );
          }
        } else {
          return ('');
        }
      },
    },
    {
      key: 'hostname',
      title: 'Hostname',
      dataIndex: 'hostname',
      sorter: (x, y) => x.hostname.localeCompare(y.hostname),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'ips',
      title: 'IPs',
      dataIndex: 'ips',
      render: (text) => (
        <div style={{display: 'flex'}}>
          {text !== '' && text.split(',').map((item, index) => (
            <span key={index}>
              <Tag bordered={true}>{item}</Tag>
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'os',
      title: 'OS',
      dataIndex: 'os',
      sorter: (x, y) => x.os.localeCompare(y.os),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'arch',
      title: 'Arch',
      dataIndex: 'arch',
    },
    {
      key: 'kernel',
      title: 'Kernel',
      dataIndex: 'kernel',
    },
    {
      key: 'cpu',
      title: 'CPU',
      dataIndex: 'cpu',
    },
    {
      key: 'memory',
      title: 'Memory (GB)',
      dataIndex: 'memory',
    },
    {
      key: 'swap',
      title: 'SWAP (GB)',
      dataIndex: 'swap',
    },
    {
      key: 'disk',
      title: 'Disk (GB)',
      dataIndex: 'disk',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateHost(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteHost(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={(event) => {event.preventDefault(); openHostTerminal(record);}}>
            <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
          </a>
          <Divider type="vertical" />
          <a onClick={(event) => {event.preventDefault(); openHostFileBrowser(record.id, record.ssh_host);}}>
            <img src={folderIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
          </a>
          <Divider type="vertical" />
          <a onClick={(event) => {event.preventDefault(); openHostTerminalExt(record);}}>
            <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
          </a>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Host List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addHost()}>New Host</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getHosts()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeHosts}
        loading={storeHostTableLoading}
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
    </>
  );
}

export default HostList;
