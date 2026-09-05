'use client'

import { useMemo, useState } from 'react'
import { Search, MapPin, Package } from 'lucide-react'
import { PRODUCTS, CATEGORIES, formatINR, type Category } from '@/lib/data'
import { cn } from '@/lib/utils'

type Filter = 'All' | Category

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesCat = filter === 'All' || p.category === filter
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.aisle.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, filter])

  const filters: Filter[] = ['All', ...CATEGORIES]

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Product Catalog
          </h1>
          <p className="text-sm text-zinc-500">{PRODUCTS.length} SKUs · live shelf inventory</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, SKU or aisle…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-700"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f
                ? 'border-zinc-100 bg-zinc-100 text-zinc-950'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 py-20 text-center">
          <Package className="size-6 text-zinc-600" />
          <p className="text-sm text-zinc-400">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const low = p.stock <= 10
            return (
              <article
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    {p.category}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-600">{p.id}</span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-medium leading-snug text-zinc-100 text-balance">
                    {p.name}
                  </h2>
                  <span className="text-xs text-zinc-500">{p.brand}</span>
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-zinc-800 pt-3">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                      <MapPin className="size-3" />
                      {p.aisle}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 font-mono text-[11px]',
                        low ? 'text-amber-400' : 'text-zinc-400',
                      )}
                    >
                      <Package className="size-3" />
                      {p.stock} in stock
                    </span>
                  </div>
                  <span className="font-mono text-lg font-semibold tabular-nums text-zinc-50">
                    {formatINR(p.price)}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
