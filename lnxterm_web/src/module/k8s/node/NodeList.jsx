import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';

function NodeList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const storeNodes = useSelector(store.getNodes);
  const storeNodeTableLoading = useSelector(store.getNodeTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {cluster_id} = context;

    form.resetFields();

    try {
      dispatch(store.setNodeTableLoading(true));

      const response = await api.get_clusters();
      dispatch(commonStore.setClusters(response.data.data));

      const clusters = response.data.data;
      if (clusters.length === 0) {
        message.info('Cluster not found');
        return;
      }

      if (cluster_id === undefined) {
        cluster_id = clusters[0].id;
        dispatch(commonStore.setContext({cluster_id}));
      }

      form.setFieldsValue({cluster_id});

      const response2 = await api.get_nodes(cluster_id);
      dispatch(store.setNodes(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNodeTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(store.setNodes([]));

    try {
      dispatch(store.setNodeTableLoading(true));
      const response = await api.get_nodes(cluster_id);
      dispatch(store.setNodes(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNodeTableLoading(false));
    }
  }

  function getNode(node) {
    dispatch(store.setNode(node));
    dispatch(store.setNodeDetailVisible(true));
  }

  function getNodeYaml(node) {
    dispatch(store.setNode(node));
    dispatch(store.setNodeYamlVisible(true));
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
    const cluster_id = form_value.cluster_id;

    try {
      dispatch(store.setNodeTableLoading(true));
      const response = await api.get_nodes(cluster_id);
      dispatch(store.setNodes(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNodeTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getNode(record)}>{text}</Button>
      ),
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      key: 'hostname',
      title: 'Hostname',
      dataIndex: 'hostname',
    },
    {
      key: 'os',
      title: 'OS',
      dataIndex: 'os',
    },
    {
      key: 'os_image',
      title: 'OS Image',
      dataIndex: 'os_image',
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
      title: 'Memory',
      dataIndex: 'memory',
    },
    {
      key: 'storage',
      title: 'Storage',
      dataIndex: 'storage',
    },
    {
      key: 'runtime',
      title: 'Runtime',
      dataIndex: 'runtime',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (text) => {
        if (text === 'Ready') {
          return (<span><Tag color="success" bordered={false}>{text}</Tag></span>);
        } else {
          return (<span><Tag bordered={false}>{text}</Tag></span>);
        }
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button type="link" className="ButtonLink" onClick={() => getNodeYaml(record)}>YAML</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="cluster_id" label="Cluster" style={{marginTop: '2px'}}>
            <Select
              allowClear={false}
              style={{width: 200}}
              onChange={(value) => changeCluster(value)}
              options={commonStoreClusters.map((item) => (
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
          <span className="MyContentHeaderTitle">Node List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeNodes}
          loading={storeNodeTableLoading}
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

export default NodeList;
