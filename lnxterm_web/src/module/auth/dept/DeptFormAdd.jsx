import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function DeptFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeDeptFormAddVisible = useSelector(store.getDeptFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const dept = form.getFieldsValue();

    const {name} = dept;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.add_dept(dept);
      message.success('Request succeeded', 1);
      dispatch(store.setDeptFormAddVisible(false));

      dispatch(store.setDeptTableLoading(true));
      const response = await api.get_depts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="New Department"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeDeptFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setDeptFormAddVisible(false))}
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

export default DeptFormAdd;
