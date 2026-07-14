import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-card-border bg-card text-card-foreground shadow-2xl backdrop-blur-xs',
      className,
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold text-lg leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
