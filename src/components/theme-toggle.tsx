'use client'
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Icon } from './ui/icon'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="toggle theme" size="icon" variant="ghost">
          <Icon
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            size="lg">
            <IconSun />
          </Icon>
          <Icon
            className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            size="lg">
            <IconMoon />
          </Icon>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Icon className="mr-2">
            <IconSun />
          </Icon>
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Icon className="mr-2">
            <IconMoon />
          </Icon>
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Icon className="mr-2">
            <IconDeviceDesktop />
          </Icon>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
