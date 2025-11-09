import {useEffect} from 'react';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {FileTextOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {FitAddon} from '@xterm/addon-fit';
import {Terminal} from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import api from './api.js';
import store from './store.js';

function PodLog() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeContext = useSelector(store.getContext);
  const storePod = useSelector(store.getPod);
  const storePodLogVisible = useSelector(store.getPodLogVisible);

  const termRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddonInstance = useRef(null);
  const wsInstance = useRef(null);
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
      if (wsInstance !== null) {
        const ws = wsInstance.current;
        if (ws !== null) {
          ws.close();
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    if (wsInstance.current !== null) {
      const ws = wsInstance.current;
      if (ws !== null) {
        ws.close();
      }
    }

    const pod = storePod;
    const container_name = storeContext.container_name;

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

      const response = await api.get_pod_log(pod, container_name);
      term.write(response.data.data);
    } else {
      const response = await api.get_pod_log(pod, container_name);
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
    const pod = storePod;
    const container_name = storeContext.container_name;

    try {
      await api.download_pod_log(pod, container_name);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function tailf() {
    if (wsInstance.current !== null) {
      const ws = wsInstance.current;
      if (ws !== null) {
        ws.close();
      }
    }

    const term = termInstance.current;
    const fitAddon = fitAddonInstance.current;

    // term.reset();
    term.clear()
    fitAddon.fit();

    const pod = storePod;
    const cluster_id = pod.cluster_id;
    const namespace = pod.namespace;
    const name = pod.name;
    const container_name = storeContext.container_name;

    let url = 'ws://' + window.location.host + '/api/k8s/pod/ws_get_pod_log';
    url = url + '?cluster_id=' + cluster_id;
    url = url + '&namespace=' + namespace;
    url = url + '&name=' + name;
    url = url + '&container_name=' + container_name;
    console.log(url);

    const ws = new WebSocket(url);
    wsInstance.current = ws;

    ws.onopen = (event) => {
      console.log(event.type);
      console.log('ws.onopen', url)
    };

    ws.onclose = (event) => {
      console.log(event.type);
      if (event.wasClean === true) {
        console.log('ws closed cleanly');
      } else {
        console.log('ws closed unexpectedly');
      }
    };

    ws.onerror = (error) => {
      console.log('ws.onerror', error)
    };

    ws.onmessage = (event) => {
      // console.log(event.type);
      term.write(event.data);
    };

    const handleResize = () => {
      console.log('resize');
      fitAddon.fit();
    };
    resizeHandler.current = handleResize;
    window.addEventListener('resize', handleResize);
  }

  function refresh() {
    init();
  }

  return (
    <>
      <Modal
        title="Pod Log"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storePodLogVisible}
        onCancel={() => dispatch(store.setPodLogVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPodLogVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storePod.namespace} / {storePod.name} / {storeContext.container_name}
          </span>
          <Space>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => download()}>Download</Button>
            <Button type="primary" icon={<FileTextOutlined />} onClick={() => tailf()}>Tailf</Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>
        <div
          ref={termRef}
          style={{
            margin: 0,
            padding: 0,
            // padding: '5px',
            width: '100%',
            height: '100%',
            // backgroundColor: '#000',
            // border: '1px solid red',
          }}
        >
        </div>
      </Modal>
    </>
  );
}

export default PodLog;
