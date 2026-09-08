import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import Sidebar from './Sidebar'

export default function MobileDrawer({ open, onClose }) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-[var(--shadow-warm-lg)] dark:bg-neutral-900">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="h-4 w-4" />
        </button>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>,
    document.body
  )
}
