import { cn } from '../../utils/cn'

const VARIANTS = {
  neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
