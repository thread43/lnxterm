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
  const storeUserFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  const [form] = Form.useForm();

  async function changePassword() {
    const passwords = form.getFieldsValue();

    const {old_password, new_password, confirm_password} = passwords;
    if (old_password === undefined || old_password.trim() === '') {
      message.info('Old password is required');
      return;
    }
    if (new_password === undefined || new_password.trim() === '') {
      message.info('New password is required');
      return;
    }
    if (confirm_password === undefined || confirm_password.trim() === '') {
      message.info('Confirm password is required');
      return;
    }
    if (confirm_password !== new_password) {
      message.info('Passwords do not match');
      return;
    }

    try {
      await api.change_password(passwords);
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
        title="Change Password"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserFormPasswordVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormPasswordVisible(false))}
        onOk={() => changePassword()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
        >
          <Form.Item name="old_password" label="Old Password" required>
            <Input type="password" />
          </Form.Item>

          <Form.Item name="new_password" label="New Password" required>
            <Input type="password" />
          </Form.Item>

          <Form.Item name="confirm_password" label="Confirm Password" required>
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormPassword;
