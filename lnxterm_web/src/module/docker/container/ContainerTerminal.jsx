import {useEffect} from 'react';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import {FitAddon} from '@xterm/addon-fit';
import {Terminal} from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import store from './store.js';

function ContainerTerminal() {
  const dispatch = useDispatch();
  const storeContainer = useSelector(store.getContainer);
  const storeContainerTerminalVisible = useSelector(store.getContainerTerminalVisible);

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

      if (wsInstance.current !== null) {
        const ws = wsInstance.current;
        if (ws !== null) {
          ws.close();
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function init() {
    if (wsInstance.current !== null) {
      const ws = wsInstance.current;
      if (ws !== null) {
        ws.close();
      }
    }

    const server_id = storeContainer.server_id;
    const container_id = storeContainer.container_id;
    const command = null;

    let url = 'ws://' + window.location.host + '/api/docker/container/ws_open_container_terminal';
    url = url + '?server_id=' + server_id;
    url = url + '&container_id=' + container_id;
    if (command !== null) {
      url = url + '&command=' + command;
    }
    console.log(url);

    let term = termInstance.current;
    let fitAddon = fitAddonInstance.current;

    if (termInstance.current === null) {
      term = new Terminal({
        convertEol: true,
        cursorBlink: true,
      });
      termInstance.current = term;

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonInstance.current = fitAddon;

      term.open(termRef.current);
      fitAddon.fit();

      term.write('Connecting...\n');
    } else {
      term = termInstance.current;
      term.reset();

      fitAddon = fitAddonInstance.current;
      fitAddon.fit();

      term.write('Reconnecting...\n');
    }

    const ws = new WebSocket(url);
    wsInstance.current = ws;

    ws.onopen = (event) => {
      console.log(event.type);
      console.log('ws.onopen', url)

      console.log({termCols: term.cols, termRows: term.rows, ...fitAddon.proposeDimensions()});
      const msg = JSON.stringify({action: 'resize', cols: term.cols, rows: term.rows});
      ws.send(msg);

      term.focus();
    }

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

    term.onData((data) => {
      const msg = JSON.stringify({action: 'stdin', data: data});
      console.log(msg)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      } else {
        console.log('ws is not open', ws.readyState);
      }
    });

    term.onResize(({cols, rows}) => {
      const msg = JSON.stringify({action: 'resize', cols: cols, rows: rows});
      console.log(msg)
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      } else {
        console.log('ws is not open', ws.readyState);
      }
    });

    const handleResize = () => {
      console.log('resize');
      fitAddon.fit();
    };
    resizeHandler.current = handleResize;
    window.addEventListener('resize', handleResize);
  }

  function reconnect() {
    init();
  }

  return (
    <>
      <Modal
        title="Container Terminal"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        // maskClosable={false}
        open={storeContainerTerminalVisible}
        onCancel={() => dispatch(store.setContainerTerminalVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setContainerTerminalVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeContainer.name}
          </span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => reconnect()}>Reconnect</Button>
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

export default ContainerTerminal;
