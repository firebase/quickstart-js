import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/v1beta/projects': {
        target: 'http://127.0.0.1:9399',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1beta\/projects/, '/v1beta/projects'),
      },
    },
  },
})
