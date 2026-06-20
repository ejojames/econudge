import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,  // Prevent raw development module exposure in production bundle
    minify: 'terser',  // Terser provides superior dead-code elimination vs esbuild default
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'node_modules/**'],
    },
  },
})
