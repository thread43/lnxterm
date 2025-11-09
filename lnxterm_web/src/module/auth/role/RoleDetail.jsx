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

function RoleDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeRole = useSelector(store.getRole);
  const storeRoleDetailVisible = useSelector(store.getRoleDetailVisible);

  const [stateRole, setStateRole] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeRole;

    try {
      setStateLoading(true);
      const response = await api.get_role(id);
      setStateRole(response.data.data);
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
        title="Role Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeRoleDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setRoleDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setRoleDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateRole.id}</Form.Item>
          <Form.Item label="Name">{stateRole.name}</Form.Item>
          <Form.Item label="Remark">{stateRole.remark}</Form.Item>
          <Form.Item label="Created At">{stateRole.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateRole.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RoleDetail;
