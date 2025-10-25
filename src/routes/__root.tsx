import {
  createRootRoute,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from '@tanstack/react-router'
import clsx from 'clsx'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HexagonGrid } from '@/components/hexagon-grid'
import {
  getSystemTheme,
  getThemeServerFn,
  ThemeProvider,
} from '@/context/theme-context'
import { siteConfig } from '@/lib/config'
import { seo } from '@/lib/seo'
import css from '@/styles/index.css?url'

const { language = 'en', textDirection = 'ltr' } = siteConfig

function RootDocument({
  children,
  theme,
}: Readonly<{
  children: React.ReactNode
  theme: string
}>) {
  return (
    <html
      className={clsx(
        "bg-[url('/img/bg.svg')] bg-center bg-cover bg-white bg-fixed bg-no-repeat",
        theme,
      )}
      dir={textDirection}
      lang={language}
    >
      <head>
        <HeadContent />
        {/*
          Crucial for FOUC: Add a script that immediately sets the theme
          based on prefers-color-scheme before hydration, specifically
          for "system" preference and if a cookie wasn't explicitly set.
          This prevents a flash *even* if the server defaults to light
          and the system prefers dark. This is often called a "dark mode script".
        */}
        <ScriptOnce>
          {`;(() => {
  const themeCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('ui-theme='))
  const theme = themeCookie ? themeCookie.split('=')[1] : 'system'

  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }
})()`}
        </ScriptOnce>
      </head>
      <body className="flex min-h-screen min-w-min flex-col bg-background/90 font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const { preferredTheme, initialResolvedTheme } = Route.useLoaderData()
  return (
    <ThemeProvider initialTheme={preferredTheme}>
      <RootDocument theme={initialResolvedTheme}>
        <HexagonGrid />
        <Header />
        <main className="container flex flex-auto py-8">
          <Outlet />
        </main>
        <Footer />
      </RootDocument>
    </ThemeProvider>
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
  loader: async () => {
    const preferredTheme = await getThemeServerFn()
    // On the server, resolve the 'system' theme immediately for initial render
    const initialResolvedTheme =
      preferredTheme === 'system' ? getSystemTheme() : preferredTheme

    return {
      preferredTheme,
      initialResolvedTheme,
    }
  },
})
