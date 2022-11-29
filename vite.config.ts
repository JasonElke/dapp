import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import vitePluginImp from 'vite-plugin-imp';
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';
// import { build } from 'esbuild';
// import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: 'env',
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  publicDir: 'src/assets',
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: `http://115.165.166.135:8081/api`,
        // changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    host: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#FF2F48' },
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    vitePluginImp({
      libList: [
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        /**
         * Fix Buffer is not defined error for running production build
         * https://www.npmjs.com/package/rollup-plugin-node-polyfills
         */
        nodePolyfills(),
      ],
    },

    /**
     * Fix require is not defined error
     * https://github.com/wobsoriano/v-dashboard/issues/20
     * https://github.com/originjs/vite-plugins/issues/9
     */
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

// build({
//   plugins: [
//     GlobalsPolyfills({
//       process: true,
//       buffer: true,
//       define: { 'process.env.var': '"hello"' }, // inject will override define, to keep env vars you must also pass define here https://github.com/evanw/esbuild/issues/660
//     }),
//   ],
// });
