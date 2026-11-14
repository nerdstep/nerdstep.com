import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// TanStack Start's client packages import the app's router (and through it all
// site code). A chunk group pulls in its modules' dependencies, so grouping these
// would drag the whole app along. They stay with the entry chunk instead.
const START_CLIENT = /\/node_modules\/@tanstack\/(?:react-start|start-)[^/]*\//

/** Matches modules in the given node_modules packages, except Start's client. */
const vendor = (packages: RegExp) => {
  const pattern = new RegExp(String.raw`/node_modules/(?:${packages.source})/`)
  return (id: string) => pattern.test(id) && !START_CLIENT.test(id)
}

export default defineConfig({
  server: {
    port: 3100,
    strictPort: true,
  },
  build: {
    emptyOutDir: true,
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            // Split vendor code by how often it changes, so a deploy that only
            // touches site code keeps React and the router cached.
            codeSplitting: {
              groups: [
                { name: 'react', test: vendor(/react|react-dom|scheduler/), priority: 3 },
                { name: 'tanstack', test: vendor(/@tanstack\/[^/]+|seroval[^/]*/), priority: 2 },
                // UI kits the lazy drawers share are left out, so Rolldown puts
                // their drawer-only modules in the drawers chunk.
                {
                  name: 'vendor',
                  test: vendor(/(?!@base-ui\/|@floating-ui\/|@tabler\/)[^/]+/),
                  priority: 1,
                },
              ],
            },
          },
        },
      },
    },
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
})
