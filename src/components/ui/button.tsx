import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ui-ring focus-visible:ring-ui-ring/50 focus-visible:ring-[3px] aria-invalid:ring-ui-destructive/20 dark:aria-invalid:ring-ui-destructive/40 aria-invalid:border-ui-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-tertiary',
        destructive:
          'bg-ui-destructive text-white hover:bg-ui-destructive/90 focus-visible:ring-ui-destructive/20 dark:focus-visible:ring-ui-destructive/40 dark:bg-ui-destructive/60',
        outline:
          'border bg-ui-background shadow-xs hover:bg-ui-accent hover:text-ui-accent-foreground dark:bg-ui-input/30 dark:border-ui-input dark:hover:bg-ui-input/50',
        secondary: 'bg-secondary text-white hover:bg-secondary/80',
        ghost:
          'hover:bg-ui-accent hover:text-ui-accent-foreground dark:hover:bg-ui-accent/50',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
