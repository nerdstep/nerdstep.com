import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import z from 'zod'

const storageKey = 'ui-theme'

const themeSchema = z.enum(['dark', 'light', 'system'])

export type Theme = z.infer<typeof themeSchema>

type ThemeProviderProps = {
  children: React.ReactNode
  initialTheme: Theme
}

type ThemeProviderState = {
  theme: Theme
  // The actual theme being applied (system resolved)
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
}

export const getThemeServerFn = createServerFn().handler(async () => {
  return (getCookie(storageKey) || 'light') as Theme
})

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const theme = themeSchema.safeParse(data)
    if (!theme.success) {
      throw new Error('Invalid theme provided')
    }
    return theme.data
  })
  .handler(async ({ data }) => {
    setCookie(storageKey, data, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    })
  })

/**
 * Helper function to determine the actual light/dark theme based on
 * system preference. This will be used on both client and server
 * to apply the correct class.
 */
export const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
)

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const router = useRouter()
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  // State to hold the actual light/dark theme determined by system preference
  const [systemDetectedTheme, setSystemDetectedTheme] = useState<
    'light' | 'dark'
  >(() => (initialTheme === 'system' ? getSystemTheme() : initialTheme))

  // Determine the resolved theme (the actual one to apply to the DOM)
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemDetectedTheme
    }
    return theme
  }, [theme, systemDetectedTheme])

  // Effect to listen for system theme changes on the client
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemDetectedTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      // Set initial value in case it changed since initial render
      setSystemDetectedTheme(mediaQuery.matches ? 'dark' : 'light')

      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Effect to update the `<html>` class on *any* theme change (user or system)
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark') // Always remove existing themes
    root.classList.add(resolvedTheme) // Add the currently resolved theme
  }, [resolvedTheme])

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      setThemeState(newTheme)
      // If setting to 'system', immediately resolve it for the client state
      if (newTheme === 'system') {
        setSystemDetectedTheme(getSystemTheme())
      }
      await setThemeServerFn({ data: newTheme })
      router.invalidate()
    },
    [router],
  )

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    // During SSR or if outside provider, return a safe fallback
    if (typeof window === 'undefined') {
      return {
        theme: 'light',
        resolvedTheme: 'light',
        setTheme: () => Promise.resolve(),
      }
    }
    throw new Error('useTheme must be used within <ThemeProvider>')
  }

  return context
}
