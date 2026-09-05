'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScanLine, LayoutDashboard, MessageSquare, Boxes, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart-context'

const NAV = [
  { href: '/checkout', label: 'Checkout', icon: ScanLine },
  { href: '/analytics', label: 'Analytics', icon: LayoutDashboard },
  { href: '/assistant', label: 'Assistant', icon: MessageSquare },
  { href: '/catalog', label: 'Catalog', icon: Boxes },
]

export function TopNav() {
  const pathname = usePathname()
  const { count, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-4 sm:px-6">
        <Link href="/checkout" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-950">
            <ScanLine className="size-4" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              SmartRetail
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Edge AI
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200',
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 lg:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] text-zinc-400">
              Edge node online
            </span>
          </span>
          <span className="hidden font-mono text-xs text-zinc-500 md:inline">
            Store #IN-042
          </span>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            className="relative flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 font-mono text-[11px] font-semibold text-zinc-950">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
