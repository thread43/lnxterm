import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ImageDetail() {
  const dispatch = useDispatch();
  const storeImage = useSelector(store.getImage);
  const storeImageDetailVisible = useSelector(store.getImageDetailVisible);

  return (
    <>
      <Modal
        title="Image Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeImageDetailVisible}
        onCancel={() => dispatch(store.setImageDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setImageDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Image ID">{storeImage.image_id_raw}</Form.Item>
          <Form.Item label="Repository">{storeImage.repository}</Form.Item>
          <Form.Item label="Tag">{storeImage.tag}</Form.Item>
          <Form.Item label="Size">{storeImage.size}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ImageDetail;
