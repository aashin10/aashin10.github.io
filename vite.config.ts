import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The site is served from the root of aashin10.github.io, so the default
// base ('/') is correct. Change it only if this ever moves to a project page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    target: 'es2022',
    sourcemap: false,
    rolldownOptions: {
      output: {
        // Libraries change far less often than the site, so they get their own
        // long-cached files.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 2 },
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion|lenis)[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})
