import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function LogDetail() {
  const dispatch = useDispatch();
  const storeLog = useSelector(store.getLog);
  const storeLogDetailVisible = useSelector(store.getLogDetailVisible);

  return (
    <>
      <Modal
        title="Log Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeLogDetailVisible}
        onCancel={() => dispatch(store.setLogDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setLogDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 9}}>
          <Form.Item label="ID">{storeLog.id}</Form.Item>
          <Form.Item label="Username">{storeLog.username}</Form.Item>
          <Form.Item label="Nickname">{storeLog.nickname}</Form.Item>
          <Form.Item label="Path">{storeLog.path}</Form.Item>
          <Form.Item label="IP">{storeLog.ip}</Form.Item>
          <Form.Item label="User Agent">{storeLog.user_agent}</Form.Item>
          <Form.Item label="Referer">{storeLog.referer}</Form.Item>
          <Form.Item label="Accessed At">{storeLog.access_time}</Form.Item>
          <Form.Item label="Created At">{storeLog.create_time}</Form.Item>
          <Form.Item label="Updated At">{storeLog.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LogDetail;
