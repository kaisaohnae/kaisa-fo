import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
		VueSetupExtend()
  ],
	base: '/', // './' 일때 정적배포는 문제발생
	optimizeDeps: {},
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "public/[name].[ext]",
        chunkFileNames: "page/[name].js",
      },
    },
  },
})
