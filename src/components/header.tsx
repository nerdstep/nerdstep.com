import { useWindowScroll } from 'react-use'
import { Logo } from '@/components/logo'
import { ThemeSwitch } from '@/components/theme-switch'
import { cn } from '@/lib/utils'

export function Header() {
  const { y } = useWindowScroll()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 w-full flex-none transition-all duration-100 ease-in md:h-20',
        y > 40 && 'bg-background/80 shadow-lg backdrop-blur-xs md:shadow-lg',
      )}
    >
      <div className="container h-full">
        <div className="flex h-full items-center justify-between">
          <Logo />
          <nav className="flex grow items-center justify-end gap-1 md:gap-4">
            <ThemeSwitch />
          </nav>
        </div>
      </div>
    </header>
  )
}
