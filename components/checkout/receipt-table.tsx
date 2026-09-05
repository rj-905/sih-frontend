'use client'

import { Minus, Plus, X, Sparkles } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { formatINR, productById, PRODUCTS } from '@/lib/data'
import { lineTotal, type LineItem } from '@/lib/checkout'
import { cn } from '@/lib/utils'

export function ReceiptTable({
  items,
  onQty,
  onResolve,
  onRemove,
}: {
  items: LineItem[]
  onQty: (lineId: string, delta: number) => void
  onResolve: (lineId: string, productId: string) => void
  onRemove: (lineId: string) => void
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <Sparkles className="size-6 text-zinc-600" />
        <p className="text-sm font-medium text-zinc-400">No provisional receipt yet</p>
        <p className="max-w-xs text-xs text-zinc-600">
          Scan the tray to let the edge vision model build a provisional receipt.
          Ambiguous and unidentified items must be resolved before checkout.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <th className="px-4 py-2.5 font-medium">Item</th>
            <th className="px-2 py-2.5 text-center font-medium">Qty</th>
            <th className="px-2 py-2.5 text-right font-medium">Unit</th>
            <th className="px-4 py-2.5 text-right font-medium">Amount</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/70">
          {items.map((line) => {
            const product = line.productId ? productById(line.productId) : undefined
            return (
              <tr key={line.lineId} className="align-top">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-medium',
                          line.status === 'KNOWN' ? 'text-zinc-100' : 'text-zinc-400',
                        )}
                      >
                        {line.label}
                      </span>
                      <StatusBadge status={line.status} />
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                      {product ? (
                        <span>{product.id}</span>
                      ) : (
                        <span>unresolved</span>
                      )}
                      <span className="text-zinc-700">·</span>
                      <span>conf {(line.confidence * 100).toFixed(0)}%</span>
                    </div>

                    {line.status === 'AMBIGUOUS' && line.candidates && (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-zinc-600">
                          resolve:
                        </span>
                        {line.candidates.map((cid) => {
                          const c = productById(cid)!
                          return (
                            <button
                              key={cid}
                              onClick={() => onResolve(line.lineId, cid)}
                              className="rounded-md border border-amber-500/25 bg-amber-500/5 px-2 py-0.5 font-mono text-[10px] text-amber-300 transition-colors hover:border-amber-400/50 hover:bg-amber-500/15"
                            >
                              {c.name} · {formatINR(c.price)}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {line.status === 'UNKNOWN' && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-zinc-600">
                          assign SKU:
                        </span>
                        <select
                          defaultValue=""
                          onChange={(e) =>
                            e.target.value && onResolve(line.lineId, e.target.value)
                          }
                          className="rounded-md border border-rose-500/25 bg-rose-500/5 px-2 py-1 font-mono text-[10px] text-rose-200 outline-none focus:border-rose-400/50"
                        >
                          <option value="" disabled>
                            Select product…
                          </option>
                          {PRODUCTS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-zinc-900">
                              {p.name} · {formatINR(p.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-2 py-3">
                  <div className="mx-auto flex w-fit items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-900">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => onQty(line.lineId, -1)}
                      className="flex size-6 items-center justify-center rounded-l-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs text-zinc-200">
                      {line.qty}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => onQty(line.lineId, 1)}
                      className="flex size-6 items-center justify-center rounded-r-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </td>

                <td className="px-2 py-3 text-right font-mono text-xs text-zinc-400">
                  {formatINR(line.price)}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-mono text-sm tabular-nums',
                    line.status === 'KNOWN' ? 'text-zinc-100' : 'text-zinc-500',
                  )}
                >
                  {formatINR(lineTotal(line))}
                </td>
                <td className="pr-2">
                  <button
                    aria-label="Remove item"
                    onClick={() => onRemove(line.lineId)}
                    className="flex size-6 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-rose-400"
                  >
                    <X className="size-3.5" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
