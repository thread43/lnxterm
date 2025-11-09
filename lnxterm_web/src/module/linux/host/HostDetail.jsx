import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function HostDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeHost = useSelector(store.getHost);
  const storeHostDetailVisible = useSelector(store.getHostDetailVisible);

  const [stateHost, setStateHost] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeHost;

    try {
      setStateLoading(true);
      const response = await api.get_host(id);
      setStateHost(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="Host Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeHostDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setHostDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setHostDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateHost.id}</Form.Item>
          <Form.Item label="IP">{stateHost.ip}</Form.Item>
          <Form.Item label="SSH Host">{stateHost.ssh_host}</Form.Item>
          <Form.Item label="SSH Port">{stateHost.ssh_port}</Form.Item>
          <Form.Item label="SSH User">{stateHost.ssh_user}</Form.Item>
          <Form.Item label="SSH Password">{stateHost.ssh_password}</Form.Item>
          <Form.Item label="SSH Private Key">{stateHost.ssh_private_key}</Form.Item>
          <Form.Item label="Remark">{stateHost.remark}</Form.Item>
          <Form.Item label="Created At">{stateHost.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateHost.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default HostDetail;
