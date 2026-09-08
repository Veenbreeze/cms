import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

import { cn } from '../../utils/cn'

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info }
const STYLES = {
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  info: 'border-neutral-200 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100',
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info
        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'flex items-start gap-2.5 rounded-lg border px-4 py-3 shadow-[var(--shadow-warm-md)]',
              STYLES[toast.type]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss" className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>,
    document.body
  )
}
