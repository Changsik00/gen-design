import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { chatApiPlugin } from './src/features/chat-viewer/chatApiPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    chatApiPlugin([
      path.resolve(__dirname, "../chats"),
      path.resolve(__dirname, "../playground/chats"),
    ]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../templates/assets"),
    },
  },
})
