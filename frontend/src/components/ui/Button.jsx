import { forwardRef } from 'react'

import { cn } from '../../utils/cn'

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary:
    'bg-accent-500 text-neutral-900 hover:bg-accent-600 active:bg-accent-700 disabled:bg-accent-200',
  outline:
    'border border-neutral-300 text-neutral-800 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800',
  ghost: 'text-neutral-700 bg-transparent hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
}

const Button = forwardRef(function Button(
  { as: Component = 'button', variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})

export default Button
