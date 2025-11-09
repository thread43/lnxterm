import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ServiceDetail() {
  const dispatch = useDispatch();
  const storeService = useSelector(store.getService);
  const storeServiceDetailVisible = useSelector(store.getServiceDetailVisible);

  return (
    <>
      <Modal
        title="Service Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServiceDetailVisible}
        onCancel={() => dispatch(store.setServiceDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setServiceDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeService.namespace}</Form.Item>
          <Form.Item label="Name">{storeService.name}</Form.Item>
          <Form.Item label="Type">{storeService.type}</Form.Item>
          <Form.Item label="Cluater IP">{storeService.cluster_ip}</Form.Item>
          <Form.Item label="Ports">
            {storeService.ports !== null && storeService.ports.map((item, index) => {
              if (item.node_port !== 0) {
                return (<div key={index}>{item.port}:{item.node_port}/{item.protocol}</div>);
              } else {
                return (<div key={index}>{item.port}/{item.protocol}</div>);
              }
            })}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ServiceDetail;
