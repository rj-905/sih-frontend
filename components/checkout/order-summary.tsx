'use client'

import { Banknote, Smartphone, CreditCard, CheckCircle2, TriangleAlert, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatINR, GST_RATE } from '@/lib/data'
import { cn } from '@/lib/utils'

export type PaymentMethod = 'Cash' | 'UPI' | 'Card'

const METHODS: { key: PaymentMethod; icon: typeof Banknote }[] = [
  { key: 'Cash', icon: Banknote },
  { key: 'UPI', icon: Smartphone },
  { key: 'Card', icon: CreditCard },
]

export function OrderSummary({
  subtotal,
  method,
  onMethod,
  allKnown,
  hasItems,
  unresolvedCount,
  onComplete,
}: {
  subtotal: number
  method: PaymentMethod
  onMethod: (m: PaymentMethod) => void
  allKnown: boolean
  hasItems: boolean
  unresolvedCount: number
  onComplete: () => void
}) {
  const tax = subtotal * GST_RATE
  const total = subtotal + tax
  const ready = hasItems && allKnown

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-sm font-medium text-zinc-300">Order Summary</h2>

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-zinc-400">Subtotal</dt>
          <dd className="font-mono tabular-nums text-zinc-200">{formatINR(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-zinc-400">GST (5%)</dt>
          <dd className="font-mono tabular-nums text-zinc-200">{formatINR(tax)}</dd>
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-zinc-800 pt-3">
          <dt className="text-base font-medium text-zinc-100">Total</dt>
          <dd className="font-mono text-xl font-semibold tabular-nums text-zinc-50">
            {formatINR(total)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Payment method
        </span>
        <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          {METHODS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onMethod(key)}
              aria-pressed={method === key}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition-colors',
                method === key
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200',
              )}
            >
              <Icon className="size-4" />
              {key}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
          ready
            ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
            : 'border-amber-500/25 bg-amber-500/10 text-amber-300',
        )}
      >
        {ready ? (
          <CheckCircle2 className="mt-px size-3.5 shrink-0" />
        ) : (
          <TriangleAlert className="mt-px size-3.5 shrink-0" />
        )}
        <span>
          {!hasItems
            ? 'Scan a tray to begin a transaction.'
            : ready
              ? 'All items identified. Ready to complete.'
              : `${unresolvedCount} item${unresolvedCount === 1 ? '' : 's'} still need resolving before checkout.`}
        </span>
      </div>

      <Button
        size="lg"
        onClick={onComplete}
        disabled={!ready}
        className="w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {ready ? (
          <>
            <CheckCircle2 className="size-4" />
            Complete Transaction · {formatINR(total)}
          </>
        ) : (
          <>
            <Lock className="size-4" />
            Complete Transaction
          </>
        )}
      </Button>
    </section>
  )
}
