import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function ServerFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServerFormAddVisible = useSelector(store.getServerFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const server = form.getFieldsValue();

    const {name, host} = server;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }
    if (host === undefined || host.trim() === '') {
      message.info('Host is required');
      return;
    }

    try {
      await api.add_server(server);
      message.success('Request succeeded', 1);
      dispatch(store.setServerFormAddVisible(false));

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

  return (
    <>
      <Modal
        title="New Server"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storeServerFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setServerFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 8}}
          wrapperCol={{span: 12}}
          initialValues={{
            host: 'unix:///var/run/docker.sock',
          }}
        >
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item
            name="host"
            label="Host"
            required
            help={
              <span>
                e.g. unix:///var/run/docker.sock
                <br />
                e.g. tcp://127.0.0.1:2375
              </span>
            }
          >
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

export default ServerFormAdd;
