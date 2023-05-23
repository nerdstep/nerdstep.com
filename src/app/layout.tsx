import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig, themeColor } from '@/lib/config'
import { fontSans } from '@/lib/fonts'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import { type Metadata } from 'next'

const {
  description,
  language = 'en',
  textDirection = 'ltr',
  title,
  url,
} = siteConfig

export const metadata: Metadata = {
  title,
  description,
  themeColor,
  metadataBase: new URL(url),
  openGraph: {
    title,
    description,
    url,
    siteName: title,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      suppressHydrationWarning
      className="bg-white bg-[url('/img/bg.svg')] bg-cover bg-fixed bg-center bg-no-repeat"
      dir={textDirection}
      lang={language}>
      <body
        className={clsx(
          'flex min-h-screen min-w-min flex-col bg-background/90 font-sans text-foreground antialiased',
          fontSans.variable
        )}>
        <ThemeProvider enableSystem attribute="class" defaultTheme="system">
          <Header />
          <main className="container flex flex-auto py-8">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
