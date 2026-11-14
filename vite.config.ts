import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3100,
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
    // React Compiler via oxc-transform-react, the native Rust port (experimental
    // in plugin-react v6). Fatal diagnostics fail the transform.
    viteReact({ compiler: { logDiagnostics: true } }),
  ],
  ssr: {
    noExternal: ['react-use'],
  },
  optimizeDeps: {
    include: ['react-use'],
  },
})
