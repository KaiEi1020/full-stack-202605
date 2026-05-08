import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001',
      '/graphql': 'http://127.0.0.1:3001',
      '/storage': 'http://127.0.0.1:3001',
    },
  },
});
