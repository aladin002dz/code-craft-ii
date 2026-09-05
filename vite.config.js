import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/code-craft-ii/',
  plugins: [react()],
  // 5173 by default; PORT lets a harness assign a free one instead.
  server: { port: Number(process.env.PORT) || 5173 },
})
