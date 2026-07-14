import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'tanstack-theme-kit'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HexagonGrid } from '@/components/hexagon-grid'
import { siteConfig } from '@/lib/config'
import { seo } from '@/lib/seo'
import css from '@/styles/index.css?url'

const { language = 'en', textDirection = 'ltr' } = siteConfig

function RootDocument({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="bg-background" dir={textDirection} lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen min-w-min flex-col bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <RootDocument>
      <ThemeProvider attribute="class">
        <HexagonGrid />
        <Header />
        <main className="container flex flex-auto py-8">
          <Outlet />
        </main>
        <Footer />
      </ThemeProvider>
    </RootDocument>
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
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootLayout,
})
