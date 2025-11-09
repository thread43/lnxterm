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

function HostFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeHost = useSelector(store.getHost);
  const storeHostFormUpdateVisible = useSelector(store.getHostFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeHost;

    try {
      setStateLoading(true);
      const response = await api.get_host(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const host = form.getFieldsValue();

    const {ip} = host;
    if (ip === undefined || ip.trim() === '') {
      message.info('IP is required');
      return;
    }

    try {
      await api.update_host(host);
      message.success('Request succeeded', 1);
      dispatch(store.setHostFormUpdateVisible(false));

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
        title="Edit Host"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeHostFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setHostFormUpdateVisible(false))}
        onOk={() => update()}
        loading={stateLoading}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
        >
          <Form.Item name="id" label="ID" style={{display: 'none'}}>
            <Input />
          </Form.Item>

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

          <Form.Item name="ssh_private_key" label="SSH Private Key">
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

export default HostFormUpdate;
