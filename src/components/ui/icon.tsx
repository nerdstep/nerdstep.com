import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type Variants = VariantProps<typeof iconVariants>

export type IconSize = Variants['size']

export interface IconProps {
  children: React.ReactNode
  className?: string
  color?: string
  size?: IconSize
  stroke?: 1 | 1.25 | 1.5 | 1.75 | 2
}

export function Icon({ children, className, size, ...props }: IconProps) {
  return (
    <Slot {...props} className={cn(iconVariants({ className, size }))}>
      {children}
    </Slot>
  )
}
