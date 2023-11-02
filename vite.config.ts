import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs';

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, './', dir);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    commonjs(),
  ],
  resolve: {
    alias: {
      '@': pathResolve('src'),
      assets: pathResolve('src/assets'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
    dedupe: ['vue'],
  },
  server: {
    host: true,
    port: 10087,
    proxy: {
      '/api': {
        target: 'http://localhost:10086',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    }
  },
})
