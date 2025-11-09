import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import api from './api.js';
import store from './store.js';

function DeploymentYaml() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeDeployment = useSelector(store.getDeployment);
  const storeDeploymentYamlVisible = useSelector(store.getDeploymentYamlVisible);

  const [stateLoading, setStateLoading] = useState(false);
  const [stateYaml, setStateYaml] = useState('');
  const [stateCopy, setStateCopy] = useState('Copy');

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      const deployment = storeDeployment;

      setStateLoading(true);

      const response = await api.get_deployment_yaml(deployment);
      setStateYaml(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  function onCopy() {
    setStateCopy('Copied');
    setTimeout(() => {
      setStateCopy('Copy');
    }, 1000);
  }

  return (
    <>
      <Modal
        title="Deployment YAML"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeDeploymentYamlVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setDeploymentYamlVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setDeploymentYamlVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeDeployment.namespace} / {storeDeployment.name}
          </span>
          <Space>
            <CopyToClipboard text={stateYaml} onCopy={() => onCopy()}>
              <Button type="primary" icon={<CopyOutlined />}>{stateCopy}</Button>
            </CopyToClipboard>
          </Space>
        </div>

        <SyntaxHighlighter
          language="yaml"
          style={docco}
          showLineNumbers={true}
        >
          {stateYaml}
        </SyntaxHighlighter>
      </Modal>
    </>
  );
}

export default DeploymentYaml;
