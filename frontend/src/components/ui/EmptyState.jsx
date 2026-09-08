import { cn } from '../../utils/cn'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-12 text-center', className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-medium text-neutral-700 dark:text-neutral-200">{title}</p>
        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}
