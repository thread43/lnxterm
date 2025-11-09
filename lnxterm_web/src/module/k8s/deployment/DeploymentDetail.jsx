import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function DeploymentDetail() {
  const dispatch = useDispatch();
  const storeDeployment = useSelector(store.getDeployment);
  const storeDeploymentDetailVisible = useSelector(store.getDeploymentDetailVisible);

  return (
    <>
      <Modal
        title="Deployment Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeDeploymentDetailVisible}
        onCancel={() => dispatch(store.setDeploymentDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setDeploymentDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeDeployment.namespace}</Form.Item>
          <Form.Item label="Name">{storeDeployment.name}</Form.Item>
          <Form.Item label="Containers">
            {storeDeployment.containers !== null && storeDeployment.containers.map((item, index) => (
              <span key={index}>
                <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                  {item.name} ({item.image})
                </div>
              </span>
            ))}
          </Form.Item>
          <Form.Item label="Status">
            {storeDeployment.status_replicas}/{storeDeployment.spec_replicas}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DeploymentDetail;
