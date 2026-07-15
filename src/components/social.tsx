import { socialLinkLitems } from '@/lib/config'
import { cn } from '@/lib/utils'
import type { IconElement } from '@/types'
import { Button } from './ui/button'

interface SocialLinkItem {
  icon: IconElement
  key: string
  label: string
  url: string
}

interface SocialProps {
  className?: string
  items?: SocialLinkItem[]
}

export function Social({ className, items = socialLinkLitems }: SocialProps) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      {items.map(({ icon, key, label, url }) => (
        <Button
          key={key}
          className="rounded-full"
          effect="ringHover"
          icon={icon}
          size="icon-lg"
          variant="outline"
          render={(props) => (
            <a
              {...props}
              aria-label={label}
              href={url}
              rel="noopener noreferrer"
              target="_blank"
            />
          )}
        />
      ))}
    </div>
  )
}
