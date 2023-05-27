import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPath from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPath(), svgr()],
  // server: {
  //   proxy: {
  //     '^/api': {
  //       target: 'http://101.101.208.191',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/\/api/, ''),
  //       secure: false,
  //     },
  //   },
  // },
})
