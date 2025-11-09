import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function MenuDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeMenu = useSelector(store.getMenu);
  const storeMenuDetailVisible = useSelector(store.getMenuDetailVisible);

  const [stateMenu, setStateMenu] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeMenu;

    try {
      setStateLoading(true);
      const response = await api.get_menu(id);
      setStateMenu(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="Menu Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeMenuDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setMenuDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setMenuDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateMenu.id}</Form.Item>
          <Form.Item label="Code">{stateMenu.code}</Form.Item>
          <Form.Item label="Name">{stateMenu.name}</Form.Item>
          <Form.Item label="Is Virtual">{stateMenu.is_virtual === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Remark">{stateMenu.remark}</Form.Item>
          <Form.Item label="Created At">{stateMenu.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateMenu.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default MenuDetail;
