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

function ClusterDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeCluster = useSelector(store.getCluster);
  const storeClusterDetailVisible = useSelector(store.getClusterDetailVisible);

  const [stateCluster, setStateCluster] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeCluster;

    try {
      setStateLoading(true);
      const response = await api.get_cluster(id);
      setStateCluster(response.data.data);
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
        title="Cluster Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storeClusterDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setClusterDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setClusterDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 8}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateCluster.id}</Form.Item>
          <Form.Item label="Name">{stateCluster.name}</Form.Item>
          <Form.Item label="Kubeconfig">{stateCluster.kubeconfig}</Form.Item>
          <Form.Item label="Server">{stateCluster.server}</Form.Item>
          <Form.Item label="Token">{stateCluster.token}</Form.Item>
          <Form.Item label="Version">{stateCluster.version}</Form.Item>
          <Form.Item label="Remark">{stateCluster.remark}</Form.Item>
          <Form.Item label="Created At">{stateCluster.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateCluster.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ClusterDetail;
