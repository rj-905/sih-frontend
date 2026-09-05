'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { TrayHud } from '@/components/checkout/tray-hud'
import { ReceiptTable } from '@/components/checkout/receipt-table'
import { OrderSummary, type PaymentMethod } from '@/components/checkout/order-summary'
import { formatINR, GST_RATE } from '@/lib/data'
import { lineTotal, resolveToProduct, scanTray, type LineItem } from '@/lib/checkout'

type Phase = 'idle' | 'scanning' | 'done'

export default function CheckoutPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [items, setItems] = useState<LineItem[]>([])
  const [method, setMethod] = useState<PaymentMethod>('UPI')
  const [receiptTotal, setReceiptTotal] = useState<number | null>(null)

  function handleScan() {
    setReceiptTotal(null)
    setPhase('scanning')
    setTimeout(() => {
      setItems(scanTray())
      setPhase('done')
    }, 1600)
  }

  function handleQty(lineId: string, delta: number) {
    setItems((prev) =>
      prev.map((l) =>
        l.lineId === lineId ? { ...l, qty: Math.max(1, l.qty + delta) } : l,
      ),
    )
  }

  function handleResolve(lineId: string, productId: string) {
    setItems((prev) =>
      prev.map((l) => (l.lineId === lineId ? resolveToProduct(l, productId) : l)),
    )
  }

  function handleRemove(lineId: string) {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId))
  }

  const subtotal = useMemo(
    () => items.reduce((sum, l) => (l.status === 'KNOWN' ? sum + lineTotal(l) : sum), 0),
    [items],
  )
  const unresolvedCount = items.filter((l) => l.status !== 'KNOWN').length
  const allKnown = items.length > 0 && unresolvedCount === 0

  function handleComplete() {
    const total = subtotal + subtotal * GST_RATE
    setReceiptTotal(total)
    setItems([])
    setPhase('idle')
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Cashier Terminal
          </h1>
          <p className="text-sm text-zinc-500">
            Computer-vision self-checkout · Lane 04
          </p>
        </div>
        {receiptTotal !== null && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <CheckCircle2 className="size-4" />
            Transaction complete · {formatINR(receiptTotal)} via {method}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
        <TrayHud phase={phase} onScan={handleScan} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Provisional Receipt</h2>
            <span className="font-mono text-[11px] text-zinc-500">
              {items.length} line{items.length === 1 ? '' : 's'} detected
            </span>
          </div>
          <ReceiptTable
            items={items}
            onQty={handleQty}
            onResolve={handleResolve}
            onRemove={handleRemove}
          />
          <p className="px-1 font-mono text-[11px] text-zinc-600">
            Unidentified items are held at ₹0.00 and cannot be sold until resolved.
          </p>
        </div>

        <OrderSummary
          subtotal={subtotal}
          method={method}
          onMethod={setMethod}
          allKnown={allKnown}
          hasItems={items.length > 0}
          unresolvedCount={unresolvedCount}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}
