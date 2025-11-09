import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function NamespaceDetail() {
  const dispatch = useDispatch();
  const storeNamespace = useSelector(store.getNamespace);
  const storeNamespaceDetailVisible = useSelector(store.getNamespaceDetailVisible);

  return (
    <>
      <Modal
        title="Namespace Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeNamespaceDetailVisible}
        onCancel={() => dispatch(store.setNamespaceDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setNamespaceDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storeNamespace.name}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default NamespaceDetail;
