import { socialLinkLitems } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Icon, type IconSize } from './ui/icon'

interface SocialLinkItem {
  icon: JSX.Element
  key: string
  label: string
  url: string
}

interface SocialProps {
  className?: string
  iconSize?: IconSize
  items?: SocialLinkItem[]
}

export function Social({
  className,
  iconSize,
  items = socialLinkLitems,
}: SocialProps) {
  return (
    <div className={cn('flex gap-1', className)}>
      {items.map(({ icon, key, label, url }) => (
        <Button key={key} asChild size="icon" variant="ghost">
          <a
            aria-label={label}
            href={url}
            rel="noopener noreferrer"
            target="_blank">
            <Icon size={iconSize}>{icon}</Icon>
          </a>
        </Button>
      ))}
    </div>
  )
}
