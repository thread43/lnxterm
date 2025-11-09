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

function UserFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storeUserFormUpdateVisible = useSelector(store.getUserFormUpdateVisible);

  const [stateDepts, setStateDepts] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeUser;

    try {
      setStateLoading(true);

      const response = await api.get_depts();
      setStateDepts(response.data.data);

      const response2 = await api.get_user(id);
      form.setFieldsValue(response2.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const user = form.getFieldsValue();

    const {username, nickname} = user;
    if (username === undefined || username.trim() === '') {
      message.info('Username is required');
      return;
    }
    if (nickname === undefined || nickname.trim() === '') {
      message.info('Nickname is required');
      return;
    }

    try {
      await api.update_user(user);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormUpdateVisible(false));

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
        title="Update User"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeUserFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormUpdateVisible(false))}
        onOk={() => update()}
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

          <Form.Item name="username" label="Username" required>
            <Input />
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

export default UserFormUpdate;
