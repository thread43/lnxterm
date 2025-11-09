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

function DeptFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeDept = useSelector(store.getDept);
  const storeDeptFormUpdateVisible = useSelector(store.getDeptFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeDept;

    try {
      setStateLoading(true);
      const response = await api.get_dept(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const dept = form.getFieldsValue();

    const {name} = dept;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.update_dept(dept);
      message.success('Request succeeded', 1);
      dispatch(store.setDeptFormUpdateVisible(false));

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
        title="Edit Department"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeDeptFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setDeptFormUpdateVisible(false))}
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

export default DeptFormUpdate;
