import { cn } from '../../utils/cn'

export default function Card({ className, children, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn(
        'rounded-xl border border-neutral-200 bg-white shadow-[var(--shadow-warm-sm)]',
        'dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('border-b border-neutral-200 px-5 py-4 dark:border-neutral-800', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}
