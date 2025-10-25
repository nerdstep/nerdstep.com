import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    emptyOutDir: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        // Specifies the directory TanStack Router uses for your routes.
        routesDirectory: 'routes',
      },
    }),
    viteReact(),
  ],
  ssr: {
    noExternal: ['react-use'],
  },
  optimizeDeps: {
    include: ['react-use'],
  },
})
