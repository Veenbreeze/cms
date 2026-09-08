import { cn } from '../../utils/cn'

function initialsFrom(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const SIZES = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' }

export default function Avatar({ src, name, size = 'md', className }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 font-medium text-primary-700',
        'dark:bg-primary-900 dark:text-primary-200',
        SIZES[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name || 'Profile photo'} className="h-full w-full object-cover" />
      ) : (
        initialsFrom(name)
      )}
    </span>
  )
}
