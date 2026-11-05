import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: { // AI-assisted - see AI-USAGE.md #<1>
    environment: 'jsdom',               // Simulates a browser environment in Node
    globals: true,                      // Allows using describe/it/expect without explicit imports
    setupFiles: './src/test/setup.js',  // Path to the test setup file
  }
});
