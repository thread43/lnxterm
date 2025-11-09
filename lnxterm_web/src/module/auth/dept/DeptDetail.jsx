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

function DeptDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeDept = useSelector(store.getDept);
  const storeDeptDetailVisible = useSelector(store.getDeptDetailVisible);

  const [stateDept, setStateDept] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeDept;

    try {
      setStateLoading(true);
      const response = await api.get_dept(id);
      setStateDept(response.data.data);
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
        title="Department Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeDeptDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setDeptDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setDeptDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateDept.id}</Form.Item>
          <Form.Item label="Name">{stateDept.name}</Form.Item>
          <Form.Item label="Remark">{stateDept.remark}</Form.Item>
          <Form.Item label="Created At">{stateDept.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateDept.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DeptDetail;
