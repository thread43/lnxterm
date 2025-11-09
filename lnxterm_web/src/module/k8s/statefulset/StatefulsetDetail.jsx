import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function StatefulsetDetail() {
  const dispatch = useDispatch();
  const storeStatefulset = useSelector(store.getStatefulset);
  const storeStatefulsetDetailVisible = useSelector(store.getStatefulsetDetailVisible);

  return (
    <>
      <Modal
        title="StatefulSet Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeStatefulsetDetailVisible}
        onCancel={() => dispatch(store.setStatefulsetDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setStatefulsetDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeStatefulset.namespace}</Form.Item>
          <Form.Item label="Name">{storeStatefulset.name}</Form.Item>
          <Form.Item label="Containers">
            {storeStatefulset.containers !== null && storeStatefulset.containers.map((item, index) => (
              <span key={index}>
                <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                  {item.name} ({item.image})
                </div>
              </span>
            ))}
          </Form.Item>
          <Form.Item label="Status">
            {storeStatefulset.status_replicas}/{storeStatefulset.spec_replicas}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StatefulsetDetail;
