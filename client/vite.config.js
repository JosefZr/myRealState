import react from '@vitejs/plugin-react'
import { defineConfig } from "vite";
import { createHtmlPlugin } from 'vite-plugin-html';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        title: 'LB STOMATOLOGY',
        description: 'Dr.Truth "Dentistry Mastery Code is the key to becoming a successful dentist who runs a profitable practice and It\'s attainable only through Building Your Dental Network {YDN}."',
        keywords: 'dental practice, dentist software, patient retention, dental management'
      }
    }
  })],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    historyApiFallback: true, // Ensures routes fallback to index.html
    watch: {
      usePolling: true, // Enable polling to prevent 'too many open files' error
      interval: 1000, // Adjust as needed (higher values reduce system load)
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optional, ensures all chunks are handled correctly
      },
    },
  },
});