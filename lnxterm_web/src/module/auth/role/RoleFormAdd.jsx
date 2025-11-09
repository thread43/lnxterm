import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function RoleFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeRoleFormAddVisible = useSelector(store.getRoleFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const role = form.getFieldsValue();

    const {name} = role;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.add_role(role);
      message.success('Request succeeded', 1);
      dispatch(store.setRoleFormAddVisible(false));

      dispatch(store.setRoleTableLoading(true));
      const response = await api.get_roles();
      dispatch(store.setRoles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setRoleTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="New Role"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeRoleFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setRoleFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
        >
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RoleFormAdd;
