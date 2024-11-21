import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/test-direct-fetch': {
        target: 'http://localhost:3001', // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
