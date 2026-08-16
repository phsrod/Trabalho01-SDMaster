import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Carrega o .env da raiz do repositório (um único arquivo para client e server)
  envDir: '..',
})
