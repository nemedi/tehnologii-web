import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dezvoltare, rutele /api sunt redirectate catre serverul Express.
    proxy: { '/api': 'http://localhost:8080' },
  },
})
