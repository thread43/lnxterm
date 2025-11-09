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

function ServerFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServer = useSelector(store.getServer);
  const storeServerFormUpdateVisible = useSelector(store.getServerFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeServer;

    try {
      setStateLoading(true);
      const response = await api.get_server(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
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
      await api.update_server(server);
      message.success('Request succeeded', 1);
      dispatch(store.setServerFormUpdateVisible(false));

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
        title="Edit Server"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storeServerFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setServerFormUpdateVisible(false))}
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

export default ServerFormUpdate;
