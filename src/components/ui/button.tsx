import { Slot, Slottable } from '@radix-ui/react-slot'
import { createLink, type LinkComponent } from '@tanstack/react-router'
import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '@/lib/utils'
import type { IconElement } from '@/types'
import { Spinner } from './spinner'

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      effect: {
        ringHover:
          'transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: IconElement
  iconPlacement?: 'left' | 'right'
  isLoading?: boolean
  loadingText?: string
}

export function Button({
  asChild = false,
  children,
  className,
  disabled,
  effect,
  icon: Icon,
  iconPlacement = 'left',
  isLoading,
  loadingText,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ className, effect, size, variant }))}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText ? loadingText : <Slottable>{children}</Slottable>}
        </>
      ) : (
        <>
          {Icon && iconPlacement === 'left' && (
            <Icon
              aria-hidden="true"
              className="-translate-y-1/2 absolute top-1/2 left-1.5"
            />
          )}
          <Slottable>{children}</Slottable>
          {Icon && iconPlacement === 'right' && <Icon aria-hidden="true" />}
        </>
      )}
    </Comp>
  )
}

const CreatedLinkComponent = createLink(Button)

export const ButtonLink: LinkComponent<typeof Button> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}
