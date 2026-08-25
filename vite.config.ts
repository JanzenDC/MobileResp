import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  publicDir: path.resolve(root, 'website/public'),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    open: true,
  },
  preview: {
    port: 5174,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
