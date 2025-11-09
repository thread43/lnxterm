import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// https://vite.dev/config/server-options.html
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    // port: 5173,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1234',
        changeOrigin: true,
      },
      '/api/linux/host/ws_open_host_terminal': {
        target: 'ws://127.0.0.1:1234',
        changeOrigin: true,
        ws: true,
      },
      '/api/docker/container/ws_open_container_terminal': {
        target: 'ws://127.0.0.1:1234',
        changeOrigin: true,
        ws: true,
      },
      '/api/k8s/pod/ws_open_pod_terminal': {
        target: 'ws://127.0.0.1:1234',
        changeOrigin: true,
        ws: true,
      },
      '/api/k8s/pod/ws_get_pod_log': {
        target: 'ws://127.0.0.1:1234',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    sourcemap: false,
  },
});
