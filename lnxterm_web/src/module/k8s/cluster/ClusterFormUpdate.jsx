import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function ClusterFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeCluster = useSelector(store.getCluster);
  const storeClusterFormUpdateVisible = useSelector(store.getClusterFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeCluster;

    try {
      setStateLoading(true);
      const response = await api.get_cluster(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const cluster = form.getFieldsValue();

    const {name, kubeconfig, server, token} = cluster;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }
    if (kubeconfig === undefined || kubeconfig.trim() === '') {
      if (server === undefined || server.trim() === '') {
        message.info('Either Kubeconfig or Server+Token is required');
        return;
      }
      if (token === undefined || token.trim() === '') {
        message.info('Either Kubeconfig or Server+Token is required');
        return;
      }
    }

    try {
      await api.update_cluster(cluster);
      message.success('Request succeeded', 1);
      dispatch(store.setClusterFormUpdateVisible(false));

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

  return (
    <>
      <Modal
        title="Edit Cluster"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storeClusterFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setClusterFormUpdateVisible(false))}
        onOk={() => update()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 8}}
          wrapperCol={{span: 12}}
        >
          <Form.Item name="id" label="ID" style={{display: 'none'}}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item
            name="kubeconfig"
            label="Kubeconfig"
            help="Either Kubeconfig or Server+Token is required, if both provided, use Kubeconfig"
          >
            <Input />
          </Form.Item>

          <Form.Item name="server" label="Server">
            <Input />
          </Form.Item>

          <Form.Item name="token" label="Token">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ClusterFormUpdate;
