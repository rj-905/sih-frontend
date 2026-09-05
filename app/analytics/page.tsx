import { IndianRupee, Receipt, Gauge, Network, TriangleAlert } from 'lucide-react'
import { KpiCard } from '@/components/analytics/kpi-card'
import { PRODUCTS, RECENT_SALES, formatINR } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Store Analytics — SmartRetail Edge AI',
}

const METHOD_STYLES: Record<string, string> = {
  UPI: 'border-zinc-700 bg-zinc-800 text-zinc-200',
  Card: 'border-zinc-700 bg-zinc-800 text-zinc-200',
  Cash: 'border-zinc-700 bg-zinc-800 text-zinc-200',
}

export default function AnalyticsPage() {
  const totalRevenue = RECENT_SALES.reduce((s, t) => s + t.total, 0)
  const lowStock = PRODUCTS.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock)

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Store Analytics
        </h1>
        <p className="text-sm text-zinc-500">
          Live edge telemetry · updated 8s ago
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatINR(totalRevenue)}
          icon={IndianRupee}
          delta={{ value: '+12.4%', up: true }}
        />
        <KpiCard
          label="Completed Transactions"
          value={String(RECENT_SALES.length * 39)}
          icon={Receipt}
          delta={{ value: '+6.1%', up: true }}
        />
        <KpiCard
          label="Scan Latency"
          value="86"
          unit="ms"
          icon={Gauge}
          delta={{ value: '-9ms', up: true }}
        />
        <KpiCard
          label="YOLO Queue Congestion"
          value="Nominal"
          icon={Network}
          status={{ text: 'Healthy', tone: 'good' }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Recent sales */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-300">Recent Sales</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-2.5 font-medium">Txn ID</th>
                  <th className="px-4 py-2.5 font-medium">Time</th>
                  <th className="px-4 py-2.5 text-center font-medium">Items</th>
                  <th className="px-4 py-2.5 font-medium">Method</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {RECENT_SALES.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-zinc-900/60">
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-300">{t.id}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{t.time}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs text-zinc-400">
                      {t.items}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          'rounded-md border px-2 py-0.5 font-mono text-[10px]',
                          METHOD_STYLES[t.method],
                        )}
                      >
                        {t.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm tabular-nums text-zinc-100">
                      {formatINR(t.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Low-stock monitor */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Low-Stock Monitor</h2>
            <span className="flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
              <TriangleAlert className="size-3" />
              {lowStock.length} at/under 10
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
            {lowStock.map((p) => {
              const critical = p.stock <= 6
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/40 px-3 py-2.5"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">{p.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {p.id} · {p.aisle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          critical ? 'bg-rose-500' : 'bg-amber-500',
                        )}
                        style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        'w-14 text-right font-mono text-sm tabular-nums',
                        critical ? 'text-rose-400' : 'text-amber-400',
                      )}
                    >
                      {p.stock} u
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
