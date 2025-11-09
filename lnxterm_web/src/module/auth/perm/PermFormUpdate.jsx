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

function PermFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeContext = useSelector(store.getContext);
  const storePerm = useSelector(store.getPerm);
  const storePermFormUpdateVisible = useSelector(store.getPermFormUpdateVisible);

  const [stateMenus, setStateMenus] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storePerm;

    try {
      setStateLoading(true);

      const response = await api.get_menus();
      setStateMenus(response.data.data);

      const response2 = await api.get_perm(id);
      form.setFieldsValue(response2.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const perm = form.getFieldsValue();

    const {code, name} = perm;
    if (code === undefined || code.trim() === '') {
      message.info('Code is required');
      return;
    }
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.update_perm(perm);
      message.success('Request succeeded', 1);
      dispatch(store.setPermFormUpdateVisible(false));

      const {menu_id} = storeContext;

      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms(menu_id);
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="Edit Permission"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storePermFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setPermFormUpdateVisible(false))}
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

          <Form.Item name="code" label="Code" required>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type" required>
            <Radio.Group>
              <Radio value={0}>Read-only</Radio>
              <Radio value={1}>Read-write</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="menu_id" label="Menu">
            <Select allowClear>
              {stateMenus.map((item, index) => (
                <Select.Option key={index} value={item.id} disabled={item.is_parent}>
                  {item.alias}
                </Select.Option>
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

export default PermFormUpdate;
