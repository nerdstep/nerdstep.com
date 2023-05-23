'use client'
import { Logo } from '@/components/logo'
import { Social } from '@/components/social'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { useWindowScroll } from 'react-use'

export function Header() {
  const { y } = useWindowScroll()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full flex-none transition-all duration-100 ease-in',
        y > 40 && 'bg-background/80 shadow-md backdrop-blur-sm md:shadow-lg'
      )}>
      <div className="container">
        <div className="flex justify-between py-4 md:py-6">
          <Logo />
          <nav className="flex grow items-center justify-end gap-1 md:gap-4">
            <Social iconSize="lg" />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
