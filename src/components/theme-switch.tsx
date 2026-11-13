import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'tanstack-theme-kit'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon-lg" className="scale-95 rounded-full">
          <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light <CheckIcon size={14} className={cn('ml-auto', theme !== 'light' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
          <CheckIcon size={14} className={cn('ml-auto', theme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
          <CheckIcon size={14} className={cn('ml-auto', theme !== 'system' && 'hidden')} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
