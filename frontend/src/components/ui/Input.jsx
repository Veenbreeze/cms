import { forwardRef } from 'react'

import { cn } from '../../utils/cn'

const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400',
        'focus:outline-2 focus:outline-offset-1 focus:outline-primary-500',
        'disabled:cursor-not-allowed disabled:bg-neutral-100',
        'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500',
        error ? 'border-danger' : 'border-neutral-300 dark:border-neutral-700',
        className
      )}
      {...props}
    />
  )
})

export default Input
