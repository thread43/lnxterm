import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import {Radio} from 'antd';
import {Select} from 'antd';
import api from './api.js';
import store from './store.js';

function UserFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUserFormAddVisible = useSelector(store.getUserFormAddVisible);

  const [stateDepts, setStateDepts] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      setStateLoading(true);
      const response = await api.get_depts();
      setStateDepts(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function add() {
    const user = form.getFieldsValue();

    const {username, password, nickname} = user;
    if (username === undefined || username.trim() === '') {
      message.info('Username is required');
      return;
    }
    if (password === undefined || password.trim() === '') {
      message.info('Password is required');
      return;
    }
    if (nickname === undefined || nickname.trim() === '') {
      message.info('Nickname is required');
      return;
    }

    try {
      await api.add_user(user);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormAddVisible(false));

      dispatch(store.setUserTableLoading(true));
      const response = await api.get_users();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="New User"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserFormAddVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
          initialValues={{
            is_admin: 0,
          }}
        >
          <Form.Item name="username" label="Username" required>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" required>
            <Input type='password' />
          </Form.Item>

          <Form.Item name="nickname" label="Nickname" required>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="is_admin" label="Is Admin" required>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="dept_id" label="Department">
            <Select allowClear>
              {stateDepts.map((item, index) => (
                <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormAdd;
