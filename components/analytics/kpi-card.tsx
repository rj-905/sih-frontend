import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  delta,
  status,
}: {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  delta?: { value: string; up: boolean }
  status?: { text: string; tone: 'good' | 'warn' | 'bad' }
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="flex size-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400">
          <Icon className="size-3.5" />
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums text-zinc-50">
          {value}
        </span>
        {unit && <span className="font-mono text-xs text-zinc-500">{unit}</span>}
      </div>

      <div className="flex items-center gap-2">
        {delta && (
          <span
            className={cn(
              'flex items-center gap-0.5 font-mono text-[11px]',
              delta.up ? 'text-emerald-400' : 'text-rose-400',
            )}
          >
            {delta.up ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {delta.value}
          </span>
        )}
        {status && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
              status.tone === 'good' && 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
              status.tone === 'warn' && 'border-amber-500/25 bg-amber-500/10 text-amber-400',
              status.tone === 'bad' && 'border-rose-500/25 bg-rose-500/10 text-rose-400',
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {status.text}
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-zinc-600">vs last shift</span>
      </div>
    </div>
  )
}
