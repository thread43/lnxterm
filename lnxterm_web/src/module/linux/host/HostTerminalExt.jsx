import {useEffect} from 'react';
import {useRef} from 'react';
import {useSearchParams} from 'react-router';
import {FitAddon} from '@xterm/addon-fit';
import {Terminal} from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

function HostTerminalExt() {
  const termRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddonInstance = useRef(null);
  const wsInstance = useRef(null);
  const resizeHandler = useRef(null);

  const [searchParams] = useSearchParams();

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

    const host_id = searchParams.get('host_id');
    const ssh_host = searchParams.get('ssh_host');
    const ssh_port = searchParams.get('ssh_port');
    const ssh_user = searchParams.get('ssh_user');

    document.title = 'ssh://' + ssh_user + '@' + ssh_host + ':' + ssh_port;

    let url = 'ws://' + window.location.host + '/api/linux/host/ws_open_host_terminal';
    url = url + '?host_id=' + host_id;
    url = url + '&ssh_host=' + ssh_host;
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

      const ws = new WebSocket(url);
      wsInstance.current = ws;

      ws.onopen = (event) => {
        console.log(event.type);
        console.log('ws.onopen', url)

        console.log({termCols: term.cols, termRows: term.rows, ...fitAddon.proposeDimensions()});
        const msg = JSON.stringify({action: 'resize', cols: term.cols, rows: term.rows});
        ws.send(msg);

        term.focus();
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
  }

  return (
    <>
      <div
        ref={termRef}
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#000'
        }}
      />
    </>
  );
}

export default HostTerminalExt;
