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

function PermDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storePerm = useSelector(store.getPerm);
  const storePermDetailVisible = useSelector(store.getPermDetailVisible);

  const [statePerm, setStatePerm] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storePerm;

    try {
      setStateLoading(true);
      const response = await api.get_perm(id);
      setStatePerm(response.data.data);
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
        title="Permission Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storePermDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setPermDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPermDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{statePerm.id}</Form.Item>
          <Form.Item label="Code">{statePerm.code}</Form.Item>
          <Form.Item label="Name">{statePerm.name}</Form.Item>
          <Form.Item label="Type">{statePerm.type === 0 ? 'Read-only' : 'Read-write'}</Form.Item>
          <Form.Item label="Remark">{statePerm.remark}</Form.Item>
          <Form.Item label="Created At">{statePerm.create_time}</Form.Item>
          <Form.Item label="Updated At">{statePerm.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PermDetail;
