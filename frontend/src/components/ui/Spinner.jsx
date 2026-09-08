import { Loader2 } from 'lucide-react'

import { cn } from '../../utils/cn'

export default function Spinner({ className, size = 20 }) {
  return <Loader2 className={cn('animate-spin text-primary-500', className)} size={size} aria-hidden="true" />
}
