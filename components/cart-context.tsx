'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { productById, type Product } from '@/lib/data'

export type CartLine = { product: Product; qty: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (open: boolean) => void
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({})
  const [open, setOpen] = useState(false)

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + qty }))
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: qty }
    })
  }, [])

  const clear = useCallback(() => setItems({}), [])

  const lines = useMemo<CartLine[]>(() => {
    return Object.entries(items)
      .map(([id, qty]) => {
        const product = productById(id)
        return product ? { product, qty } : null
      })
      .filter((l): l is CartLine => l !== null)
  }, [items])

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines],
  )

  const value = useMemo(
    () => ({ lines, count, subtotal, open, setOpen, add, remove, setQty, clear }),
    [lines, count, subtotal, open, add, remove, setQty, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
