import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { ALL_DAYS } from './src/data';

// Plugin to generate static JSON endpoints during build
const staticApiPlugin = () => ({
  name: 'static-api-generator',
  writeBundle() {
    const apiDir = resolve(__dirname, 'dist/api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }

    // Export all days
    fs.writeFileSync(
      resolve(apiDir, 'challenges.json'),
      JSON.stringify({ success: true, data: ALL_DAYS }, null, 2)
    );

    // Export 2026 specifically
    const days2026 = ALL_DAYS.filter(d => d.year === 2026);
    fs.writeFileSync(
      resolve(apiDir, '2026.json'),
      JSON.stringify({ success: true, data: days2026 }, null, 2)
    );
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for deployment (can be overridden when used as template)
  // base: './'
  base: '/monthmarathone-template/',
  plugins: [staticApiPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '404': resolve(__dirname, '404.html'),
      },
    },
  },
});
