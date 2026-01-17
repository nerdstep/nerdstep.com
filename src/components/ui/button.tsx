import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { createLink, type LinkComponent } from '@tanstack/react-router'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { IconElement } from '@/types'
import { Spinner } from './spinner'

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      effect: {
        ringHover:
          'ring-offset-background transition-all duration-300 hover:ring-2 hover:ring-primary/80 hover:ring-offset-2',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs':
          "size-6 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)]',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    icon?: IconElement
    iconPlacement?: 'left' | 'right'
    isLoading?: boolean
    loadingText?: string
  }

export function Button({
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
  const isDisabled = disabled || isLoading
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ className, effect, size, variant }))}
      focusableWhenDisabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText ? loadingText : children}
        </>
      ) : (
        <>
          {Icon && iconPlacement === 'left' && <Icon aria-hidden="true" />}
          {children}
          {Icon && iconPlacement === 'right' && <Icon aria-hidden="true" />}
        </>
      )}
    </ButtonPrimitive>
  )
}

const CreatedLinkComponent = createLink(Button)

export const ButtonLink: LinkComponent<typeof Button> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}
