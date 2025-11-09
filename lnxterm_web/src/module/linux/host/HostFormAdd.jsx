import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function HostFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeHostFormAddVisible = useSelector(store.getHostFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const host = form.getFieldsValue();

    const {ip} = host;
    if (ip === undefined || ip.trim() === '') {
      message.info('IP is required');
      return;
    }

    try {
      await api.add_host(host);
      message.success('Request succeeded', 1);
      dispatch(store.setHostFormAddVisible(false));

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

  return (
    <>
      <Modal
        title="New Host"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeHostFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setHostFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
          initialValues={{
            ssh_port: '22',
            ssh_user: 'root',
            ssh_private_key: '~/.ssh/id_rsa',
          }}
        >
          <Form.Item name="ip" label="IP" required>
            <Input />
          </Form.Item>

          <Form.Item name="ssh_host" label="SSH Host">
            <Input />
          </Form.Item>

          <Form.Item name="ssh_port" label="SSH Port">
            <Input />
          </Form.Item>

          <Form.Item name="ssh_user" label="SSH User">
            <Input />
          </Form.Item>

          <Form.Item name="ssh_password" label="SSH Password">
            <Input />
          </Form.Item>

          <Form.Item name="ssh_private_key" label="SSH Key">
            <Input />
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default HostFormAdd;
