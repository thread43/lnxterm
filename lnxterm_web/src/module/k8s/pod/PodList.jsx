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
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';
import externalLinkIcon from '/src/static/external-link.svg';
import folderIcon from '/src/static/folder-open.svg';
import terminalIcon from '/src/static/terminal-box-fill.svg';

function PodList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const commonStoreNamespaces = useSelector(commonStore.getNamespaces);
  const storePods = useSelector(store.getPods);
  const storePodTableLoading = useSelector(store.getPodTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {cluster_id, namespace} = context;

    form.resetFields();

    try {
      dispatch(store.setPodTableLoading(true));

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
      if (namespace === undefined) {
        namespace = '';
      }

      form.setFieldsValue({cluster_id, namespace});

      const response2 = await api.get_pods(cluster_id, namespace);
      dispatch(store.setPods(response2.data.data));

      const response3 = await api.get_namespaces(cluster_id);
      dispatch(commonStore.setNamespaces(response3.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPodTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;
    const namespace = '';

    form.setFieldsValue({namespace: namespace});

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(commonStore.setNamespaces([]));
    dispatch(store.setPods([]));

    try {
      dispatch(store.setPodTableLoading(true));

      const response = await api.get_pods(cluster_id, namespace);
      dispatch(store.setPods(response.data.data));

      const response2 = await api.get_namespaces(cluster_id);
      dispatch(commonStore.setNamespaces(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPodTableLoading(false));
    }
  }

  async function changeNamespace(namespace) {
    const form_value = form.getFieldsValue();
    const cluster_id = form_value.cluster_id;

    namespace = (namespace === undefined) ? '' : namespace;

    dispatch(commonStore.setContext({...commonStoreContext, namespace}));
    dispatch(store.setPods([]));

    try {
      dispatch(store.setPodTableLoading(true));
      const response = await api.get_pods(cluster_id, namespace);
      dispatch(store.setPods(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPodTableLoading(false));
    }
  }

  function getPod(pod) {
    dispatch(store.setPod(pod));
    dispatch(store.setPodDetailVisible(true));
  }

  function getPodYaml(pod) {
    dispatch(store.setPod(pod));
    dispatch(store.setPodYamlVisible(true));
  }

  function getPodLog(pod, container_name) {
    dispatch(store.setContext({...commonStoreContext, container_name}));
    dispatch(store.setPod(pod));
    dispatch(store.setPodLogVisible(true));
  }

  function openPodTerminal(pod, container_name) {
    dispatch(store.setContext({...commonStoreContext, container_name}));
    dispatch(store.setPod(pod));
    dispatch(store.setPodTerminalVisible(true));
  }

  function openPodFileBrowser(pod, container_name) {
    dispatch(store.setContext({...commonStoreContext, container_name}));
    dispatch(store.setPod(pod));
    dispatch(store.setPodFileBrowserVisible(true));
  }

  function openPodTerminalExt(pod, container_name) {
    const cluster_id = commonStoreContext.cluster_id;
    const namespace = pod.namespace;
    const pod_name = pod.name;

    let url = '/#/k8s/pod/terminal';
    url = url + '?cluster_id=' + cluster_id;
    url = url + '&namespace=' + namespace;
    url = url + '&pod_name=' + pod_name;
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
    const cluster_id = form_value.cluster_id;

    let namespace = form_value.namespace;
    namespace = (namespace === undefined) ? '' : namespace;

    try {
      dispatch(store.setPodTableLoading(true));
      const response = await api.get_pods(cluster_id, namespace);
      dispatch(store.setPods(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPodTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'namespace',
      title: 'Namespace',
      dataIndex: 'namespace',
      sorter: (x, y) => x.namespace.localeCompare(y.namespace),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getPod(record)}>{text}</Button>
      ),
    },
    {
      key: 'host_ip',
      title: 'Host IP',
      dataIndex: 'host_ip',
      sorter: (x, y) => x.host_ip.localeCompare(y.host_ip),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'pod_ip',
      title: 'Pod IP',
      dataIndex: 'pod_ip',
      sorter: (x, y) => x.pod_ip.localeCompare(y.pod_ip),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'containers',
      title: 'Containers',
      dataIndex: 'containers',
      render: (text) => (
        <>
          {text !== null && text.map((item, index) => (
            <span key={index}>
              {item.name}
            </span>
          ))}
        </>
      ),
    },
    {
      key: 'restart_count',
      title: 'Restarts',
      dataIndex: 'containers',
      render: (text) => (
        <>
          {text !== null && text.map((item, index) => (
            <span key={index}>
              {item.restart_count}
            </span>
          ))}
        </>
      ),
    },
    {
      key: 'pod_phase',
      title: 'Status',
      dataIndex: 'pod_phase',
      render: (text) => {
        if (text === 'Running') {
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
          <Button type="link" className="ButtonLink" onClick={() => getPodYaml(record)}>YAML</Button>
          <Divider type="vertical" />
          <div>
            {text !== null && text.map((item, index) => (
              <div key={index}>
                <Button type="link" className="ButtonLink" onClick={() => getPodLog(record, item.name)}>Log</Button>
                <Divider type="vertical" />
                <a onClick={(event) => {event.preventDefault(); openPodTerminal(record, item.name);}}>
                  <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
                </a>
                <Divider type="vertical" />
                <a onClick={(event) => {event.preventDefault(); openPodFileBrowser(record, item.name);}}>
                  <img src={folderIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
                </a>
                <Divider type="vertical" />
                <a onClick={(event) => {event.preventDefault(); openPodTerminalExt(record, item.name);}}>
                  <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
                </a>
              </div>
            ))}
          </div>
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
          <Form.Item name="namespace" label="Namespace" style={{marginTop: '2px'}}>
            <Select
              allowClear={true}
              style={{width: 200}}
              onChange={(value) => changeNamespace(value)}
              options={commonStoreNamespaces.map((item) => (
                {value: item.name, label: item.name}
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
          <span className="MyContentHeaderTitle">Pod List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storePods}
          loading={storePodTableLoading}
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

export default PodList;
