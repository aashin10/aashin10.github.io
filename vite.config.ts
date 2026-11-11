import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The site is served from the root of aashin10.github.io, so the default
// base ('/') is correct. Change it only if this ever moves to a project page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: { target: 'es2022', sourcemap: false },
})
