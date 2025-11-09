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

function NamespaceYaml() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeNamespace = useSelector(store.getNamespace);
  const storeNamespaceYamlVisible = useSelector(store.getNamespaceYamlVisible);

  const [stateLoading, setStateLoading] = useState(false);
  const [stateYaml, setStateYaml] = useState('');
  const [stateCopy, setStateCopy] = useState('Copy');

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      const namespace = storeNamespace;

      setStateLoading(true);

      const response = await api.get_namespace_yaml(namespace);
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
        title="Namespace YAML"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeNamespaceYamlVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setNamespaceYamlVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setNamespaceYamlVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeNamespace.name}
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

export default NamespaceYaml;
