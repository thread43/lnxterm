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

function ServerDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServer = useSelector(store.getServer);
  const storeServerDetailVisible = useSelector(store.getServerDetailVisible);

  const [stateServer, setStateServer] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeServer;

    try {
      setStateLoading(true);
      const response = await api.get_server(id);
      setStateServer(response.data.data);
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
        title="Server Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServerDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setServerDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setServerDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateServer.id}</Form.Item>
          <Form.Item label="Name">{stateServer.name}</Form.Item>
          <Form.Item label="Host">{stateServer.host}</Form.Item>
          <Form.Item label="Version">{stateServer.version}</Form.Item>
          <Form.Item label="Remark">{stateServer.remark}</Form.Item>
          <Form.Item label="Created At">{stateServer.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateServer.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ServerDetail;
