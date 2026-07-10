import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: 'localhost',
    strictPort: true,
  },
  build: {
    emptyOutDir: false,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react') || id.includes('@tanstack') || id.includes('axios')) return 'vendor-react';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('recharts')) return 'vendor-charts';
          return 'vendor';
        },
      },
    },
  },
})