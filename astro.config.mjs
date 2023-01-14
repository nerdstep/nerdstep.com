import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import { defineConfig } from 'astro/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE } from './src/config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : []

export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: true,
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  markdown: {
    remarkPlugins: [],
    extendDefaultPlugins: true,
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },

  experimental: {
    contentCollections: true,
  },
})
