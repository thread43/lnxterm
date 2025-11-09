import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function PodDetail() {
  const dispatch = useDispatch();
  const storePod = useSelector(store.getPod);
  const storePodDetailVisible = useSelector(store.getPodDetailVisible);

  return (
    <>
      <Modal
        title="Pod Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storePodDetailVisible}
        onCancel={() => dispatch(store.setPodDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPodDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storePod.namespace}</Form.Item>
          <Form.Item label="Name">{storePod.name}</Form.Item>
          <Form.Item label="Node Name">{storePod.node_name}</Form.Item>
          <Form.Item label="Host IP">{storePod.host_ip}</Form.Item>
          <Form.Item label="Pod IP">{storePod.pod_ip}</Form.Item>
          <Form.Item label="Containers">
            {storePod.containers !== null && storePod.containers.map((item, index) => (
              <span key={index}>
                <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                  {item.name} ({item.image})
                </div>
              </span>
            ))}
          </Form.Item>
          <Form.Item label="Restarts">
            {storePod.containers !== null && storePod.containers.reduce((sum, item) => (
              sum + item.restart_count
            ), 0)}
          </Form.Item>
          <Form.Item label="Status">{storePod.pod_phase}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PodDetail;
