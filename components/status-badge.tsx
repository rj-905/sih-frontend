import { cn } from '@/lib/utils'

export type ItemStatus = 'KNOWN' | 'AMBIGUOUS' | 'UNKNOWN'

const STATUS_STYLES: Record<ItemStatus, string> = {
  KNOWN: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
  AMBIGUOUS: 'border-amber-500/25 bg-amber-500/10 text-amber-400',
  UNKNOWN: 'border-rose-500/25 bg-rose-500/10 text-rose-400',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ItemStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
