import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'tanstack-theme-kit'
import { ErrorPage } from '@/components/error-page'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HexagonGrid } from '@/components/hexagon-grid'
import { NotFound } from '@/components/not-found'
import { siteConfig } from '@/lib/config'
import { seoHead } from '@/lib/seo'
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
      <body className="flex min-h-screen min-w-0 flex-col bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <ThemeProvider attribute="class">
      <HexagonGrid />
      <Header />
      <main className="container flex flex-auto py-8">
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  )
}

export const Route = createRootRoute({
  head: () => {
    const routeSeo = seoHead({
      title: siteConfig.name,
      path: '/',
    })

    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'minimum-scale=1, initial-scale=1, width=device-width',
        },
        ...routeSeo.meta,
      ],
      links: [
        { rel: 'stylesheet', href: css },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        ...routeSeo.links,
      ],
    }
  },
  component: RootLayout,
  errorComponent: ({ error, reset }: ErrorComponentProps) => (
    <main className="container flex min-h-screen py-8">
      <ErrorPage error={error} onRetry={reset} />
    </main>
  ),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})
