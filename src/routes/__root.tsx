import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { Footer } from '@/components/footer'
import { siteConfig } from '@/lib/config'
import { seo } from '@/lib/seo'
import css from '@/styles/index.css?url'

const { language = 'en', textDirection = 'ltr' } = siteConfig

function RootLayout() {
  return (
    <html
      className="bg-[url('/img/bg.svg')] bg-center bg-cover bg-white bg-fixed bg-no-repeat"
      dir={textDirection}
      lang={language}
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen min-w-min flex-col bg-background/90 font-sans text-foreground antialiased">
        <main className="container flex flex-auto py-8">
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo(siteConfig),
    ],
    links: [{ rel: 'stylesheet', href: css }],
  }),
  component: RootLayout,
})
