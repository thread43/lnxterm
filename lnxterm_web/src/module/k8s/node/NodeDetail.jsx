import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function NodeDetail() {
  const dispatch = useDispatch();
  const storeNode = useSelector(store.getNode);
  const storeNodeDetailVisible = useSelector(store.getNodeDetailVisible);

  return (
    <>
      <Modal
        title="Node Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeNodeDetailVisible}
        onCancel={() => dispatch(store.setNodeDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setNodeDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storeNode.name}</Form.Item>
          <Form.Item label="IP">{storeNode.ip}</Form.Item>
          <Form.Item label="Hostname">{storeNode.hostname}</Form.Item>
          <Form.Item label="OS">{storeNode.os}</Form.Item>
          <Form.Item label="OS Image">{storeNode.os_image}</Form.Item>
          <Form.Item label="Arch">{storeNode.arch}</Form.Item>
          <Form.Item label="Kernel">{storeNode.kernel}</Form.Item>
          <Form.Item label="CPU">{storeNode.cpu}</Form.Item>
          <Form.Item label="Memory">{storeNode.memory}</Form.Item>
          <Form.Item label="Storage">{storeNode.storage}</Form.Item>
          <Form.Item label="Runtime">{storeNode.runtime}</Form.Item>
          <Form.Item label="Status">{storeNode.status}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default NodeDetail;
