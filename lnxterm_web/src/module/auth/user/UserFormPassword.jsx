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

function UserFormPassword() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storeUserFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeUser;

    try {
      setStateLoading(true);
      const response = await api.get_user(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function resetPassword() {
    const user = form.getFieldsValue();

    const {password} = user;
    if (password === undefined || password.trim() === '') {
      message.info('Password is required');
      return;
    }

    try {
      await api.reset_password(user);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormPasswordVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  return (
    <>
      <Modal
        title="Reset Password"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserFormPasswordVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormPasswordVisible(false))}
        onOk={() => resetPassword()}
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

          <Form.Item name="username" label="Username">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="nickname" label="Nickname">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="password" label="Password" required>
            <Input type='password' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormPassword;
