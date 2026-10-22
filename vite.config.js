import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const serverPort = parseInt(env.VITE_PORT || '3001', 10);
  const backendTarget =
    env.VITE_BACKEND_PROXY_TARGET ||
    (env.ODOO_PORT ? `http://localhost:${env.ODOO_PORT}` : 'http://localhost:8019');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: serverPort,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
