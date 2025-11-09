import {useEffect} from 'react';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {FitAddon} from '@xterm/addon-fit';
import {Terminal} from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import api from './api.js';
import store from './store.js';

function ContainerLog() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeContainer = useSelector(store.getContainer);
  const storeContainerLogVisible = useSelector(store.getContainerLogVisible);

  const termRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddonInstance = useRef(null);
  const resizeHandler = useRef(null);

  useEffect(() => {
    init();

    return () => {
      if (resizeHandler.current !== null) {
        window.removeEventListener('resize', resizeHandler.current);
      }

      if (termInstance.current !== null) {
        const term = termInstance.current;
        if (term !== null) {
          term.dispose();
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const server_id = storeContainer.server_id;
    const container_id = storeContainer.container_id;

    let term = termInstance.current;
    let fitAddon = fitAddonInstance.current;

    if (termInstance.current === null) {
      term = new Terminal({
        convertEol: true,
      });
      termInstance.current = term;

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonInstance.current = fitAddon;

      term.open(termRef.current);
      fitAddon.fit();

      const response = await api.get_container_log(server_id, container_id);
      term.write(response.data.data);
    } else {
      const response = await api.get_container_log(server_id, container_id);
      term.clear()
      fitAddon.fit();
      term.write(response.data.data);
    }

    const handleResize = () => {
      console.log('resize');
      fitAddon.fit();
    };
    resizeHandler.current = handleResize;
    window.addEventListener('resize', handleResize);
  }

  async function download() {
    const server_id = storeContainer.server_id;
    const container_id = storeContainer.container_id;

    try {
      await api.download_container_log(server_id, container_id);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function refresh() {
    init();
  }

  return (
    <>
      <Modal
        title="Container Log"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeContainerLogVisible}
        onCancel={() => dispatch(store.setContainerLogVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setContainerLogVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeContainer.name}
          </span>
          <Space>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => download()}>Download</Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>
        <div
          ref={termRef}
          style={{
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
          }}
        >
        </div>
      </Modal>
    </>
  );
}

export default ContainerLog;
