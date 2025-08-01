import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['9e4a286d32f9.ngrok-free.app'],
    headers: {
      "Permissions-Policy": "microphone=*, camera=*, fullscreen=*, display-capture=*, screen-wake-lock=*"
    }
  }
});
