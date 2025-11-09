import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function UserFormProfile() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeCurrentUser = useSelector(store.getCurrentUser);
  const storeUserFormProfileVisible = useSelector(store.getUserFormProfileVisible);

  const [form] = Form.useForm();

  async function updateProfile() {
    const profile = form.getFieldsValue();

    const {nickname} = profile;
    if (nickname === undefined || nickname.trim() === '') {
      message.info('Nickname is required');
      return
    }

    try {
      await api.update_profile(profile);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormProfileVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  return (
    <>
      <Modal
        title="Edit Profile"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserFormProfileVisible}
        onCancel={() => dispatch(store.setUserFormProfileVisible(false))}
        onOk={() => updateProfile()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
          initialValues={{
            username: storeCurrentUser.username,
            nickname: storeCurrentUser.nickname,
            email: storeCurrentUser.email,
          }}
        >
          <Form.Item name="id" label="ID" style={{display: 'none'}}>
            <Input />
          </Form.Item>

          <Form.Item name="username" label="Username">
            <Input disabled />
          </Form.Item>

          <Form.Item name="nickname" label="Nickname" required>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormProfile;
