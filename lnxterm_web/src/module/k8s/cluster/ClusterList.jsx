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

function ClusterList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeClusters = useSelector(store.getClusters);
  const storeClusterTableLoading = useSelector(store.getClusterTableLoading);

  useEffect(() => {
    getClusters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addCluster() {
    dispatch(store.setCluster({}));
    dispatch(store.setClusterFormAddVisible(true));
  }

  async function deleteCluster(id) {
    try {
      await api.delete_cluster(id);
      message.success('Request succeeded', 1);

      dispatch(store.setClusterTableLoading(true));
      const response = await api.get_clusters();
      dispatch(store.setClusters(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setClusterTableLoading(false));
    }
  }

  function getCluster(id) {
    dispatch(store.setCluster({id}));
    dispatch(store.setClusterDetailVisible(true));
  }

  async function getClusters() {
    try {
      dispatch(store.setClusterTableLoading(true));
      const response = await api.get_clusters();
      dispatch(store.setClusters(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setClusterTableLoading(false));
    }
  }

  function updateCluster(id) {
    dispatch(store.setCluster({id}));
    dispatch(store.setClusterFormUpdateVisible(true));
  }

  function getEvents(cluster) {
    dispatch(store.setCluster(cluster));
    dispatch(store.setEventListVisible(true));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getCluster(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'kubeconfig',
      title: 'Kubeconfig',
      dataIndex: 'kubeconfig',
    },
    {
      key: 'server',
      title: 'Server',
      dataIndex: 'server',
      render: (text) => {
        if (text !== '') {
          return (<a href={text} target="_blank">{text}&nbsp;<ExportOutlined /></a>);
        } else {
          return ('');
        }
      }
    },
    {
      key: 'token',
      title: 'Token',
      dataIndex: 'token',
      render: (text) => (text !== '') ? ('******') : (''),
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
          <Button type="link" className="ButtonLink" onClick={() => updateCluster(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteCluster(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => getEvents(record)}>Events</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Cluster List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addCluster()}>New Cluster</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getClusters()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeClusters}
        loading={storeClusterTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default ClusterList;
