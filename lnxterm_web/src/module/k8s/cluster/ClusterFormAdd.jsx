import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function ClusterFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeClusterFormAddVisible = useSelector(store.getClusterFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
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
      await api.add_cluster(cluster);
      message.success('Request succeeded', 1);
      dispatch(store.setClusterFormAddVisible(false));

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
        title="New Cluster"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storeClusterFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setClusterFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 8}}
          wrapperCol={{span: 12}}
          initialValues={{
            kubeconfig: '~/.kube/config',
          }}
        >
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

export default ClusterFormAdd;
