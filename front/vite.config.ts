import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths"
import { resolve } from 'path';

export default defineConfig({
  base: '/', 
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: resolve(__dirname, "../back/public"),
    emptyOutDir: true,
  },
  server: {
    open: true, 
  },
});