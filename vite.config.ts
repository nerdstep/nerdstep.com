import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    emptyOutDir: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
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
