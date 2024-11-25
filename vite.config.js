// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   base: '/WeaveSense/', // Update this to match your repository name
//   server: {
//     proxy: {
//       '/test-direct-fetch': {
//         target: 'http://localhost:3001', // Backend server
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  server: {
    proxy: {
      '/test-direct-fetch': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

