import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';

function NamespaceList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const storeNamespaces = useSelector(store.getNamespaces);
  const storeNamespaceTableLoading = useSelector(store.getNamespaceTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {cluster_id} = context;

    form.resetFields();

    try {
      dispatch(store.setNamespaceTableLoading(true));

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

      const response2 = await api.get_namespaces(cluster_id);
      dispatch(store.setNamespaces(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNamespaceTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(store.setNamespaces([]));

    try {
      dispatch(store.setNamespaceTableLoading(true));
      const response = await api.get_namespaces(cluster_id);
      dispatch(store.setNamespaces(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNamespaceTableLoading(false));
    }
  }

  // function getNamespace(namespace) {
  //   dispatch(store.setNamespace(namespace));
  //   dispatch(store.setNamespaceDetailVisible(true));
  // }

  function getNamespaceYaml(namespace) {
    dispatch(store.setNamespace(namespace));
    dispatch(store.setNamespaceYamlVisible(true));
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
      dispatch(store.setNamespaceTableLoading(true));
      const response = await api.get_namespaces(cluster_id);
      dispatch(store.setNamespaces(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNamespaceTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      // render: (text, record) => (
      //   <Button type="link" className="ButtonLink" onClick={() => getNamespace(record)}>{text}</Button>
      // ),
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button type="link" className="ButtonLink" onClick={() => getNamespaceYaml(record)}>YAML</Button>
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
          <span className="MyContentHeaderTitle">Namespace List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeNamespaces}
          loading={storeNamespaceTableLoading}
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

export default NamespaceList;
