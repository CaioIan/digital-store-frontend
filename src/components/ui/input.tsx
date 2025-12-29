import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-ui-foreground placeholder:text-ui-muted-foreground selection:bg-primary selection:text-white dark:bg-ui-input/30 border-ui-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ui-ring focus-visible:ring-ui-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-ui-destructive/20 dark:aria-invalid:ring-ui-destructive/40 aria-invalid:border-ui-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
