import { ThemeSwitch } from '@/components/theme-switch'

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full flex-none md:h-20">
      <div className="container flex h-full items-center justify-end">
        <ThemeSwitch />
      </div>
    </header>
  )
}
