import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../../utils/cn'

const Select = forwardRef(function Select({ className, error, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-neutral-900',
          'focus:outline-2 focus:outline-offset-1 focus:outline-primary-500',
          'disabled:cursor-not-allowed disabled:bg-neutral-100',
          'dark:bg-neutral-900 dark:text-neutral-100',
          error ? 'border-danger' : 'border-neutral-300 dark:border-neutral-700',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  )
})

export default Select
