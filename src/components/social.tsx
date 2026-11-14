import { socialLinkLitems } from '@/lib/config'
import { cn } from '@/lib/utils'
import type { IconElement } from '@/types'

import { AnchorButton } from './ui/button'

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
      {items.map(({ icon: Icon, key, label, url }) => (
        <AnchorButton
          key={key}
          aria-label={label}
          className="rounded-full"
          effect="ringHover"
          href={url}
          rel="noopener noreferrer"
          size="icon-lg"
          target="_blank"
          variant="outline"
        >
          <Icon aria-hidden="true" />
        </AnchorButton>
      ))}
    </div>
  )
}
