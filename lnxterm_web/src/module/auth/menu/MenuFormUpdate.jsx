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

function MenuFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeMenu = useSelector(store.getMenu);
  const storeMenuFormUpdateVisible = useSelector(store.getMenuFormUpdateVisible);

  const [stateMenu, setStateMenu] = useState({});
  const [stateParentMenus, setStateParentMenus] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeMenu;

    try {
      setStateLoading(true);

      const response = await api.get_parent_menus();
      setStateParentMenus(response.data.data);

      const response2 = await api.get_menu(id);
      setStateMenu(response2.data.data);
      form.setFieldsValue(response2.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const menu = form.getFieldsValue();

    const {code, name} = menu;
    if (code === undefined || code.trim() === '') {
      message.info('Code is required');
      return;
    }
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.update_menu(menu);
      message.success('Request succeeded', 1);
      dispatch(store.setMenuFormUpdateVisible(false));

      dispatch(store.setMenuTableLoading(true));
      const response = await api.get_menus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setMenuTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="Edit Menu"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeMenuFormUpdateVisible}
        loading={stateLoading}
        okText="Submit"
        onCancel={() => dispatch(store.setMenuFormUpdateVisible(false))}
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

          <Form.Item name="is_virtual" label="Is Virtual" required>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="parent_menu_id" label="Parent Menu">
            <Select allowClear>
              {stateParentMenus.map((item, index) => (
                <Select.Option
                  key={index}
                  value={item.id}
                  disabled={(stateMenu.id === item.id || stateMenu.has_children === true)}
                >
                  {item.code} ({item.name})
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

export default MenuFormUpdate;
