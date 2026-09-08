import { cn } from '../../utils/cn'

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
            active === tab.value
              ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
