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

function UserDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storeUserDetailVisible = useSelector(store.getUserDetailVisible);

  const [stateUser, setStateUser] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeUser;

    try {
      setStateLoading(true);
      const response = await api.get_user(id);
      setStateUser(response.data.data);
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
        title="User Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setUserDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setUserDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateUser.id}</Form.Item>
          <Form.Item label="Username">{stateUser.username}</Form.Item>
          <Form.Item label="Nickname">{stateUser.nickname}</Form.Item>
          <Form.Item label="Email">{stateUser.email}</Form.Item>
          <Form.Item label="Phone">{stateUser.phone}</Form.Item>
          <Form.Item label="Is Admin">{stateUser.is_admin === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Is Active">{stateUser.is_active === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Remark">{stateUser.remark}</Form.Item>
          <Form.Item label="Created At">{stateUser.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateUser.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserDetail;
