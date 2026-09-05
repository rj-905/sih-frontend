import type { ItemStatus } from '@/components/status-badge'
import { productById } from '@/lib/data'

export type LineItem = {
  lineId: string
  status: ItemStatus
  qty: number
  /** Resolved product id (KNOWN only). */
  productId?: string
  /** Display label — for UNKNOWN this is the vision system's guess. */
  label: string
  /** Unit price. Always 0 until the item is KNOWN. */
  price: number
  /** Vision detection confidence 0–1. */
  confidence: number
  /** Candidate product ids for AMBIGUOUS items. */
  candidates?: string[]
}

let scanCounter = 0

/**
 * Simulates a single tray scan from the overhead vision model. Returns a
 * provisional receipt containing a realistic mix of KNOWN, AMBIGUOUS and
 * UNKNOWN detections. Unknown/ambiguous items are always priced at ₹0.00.
 */
export function scanTray(): LineItem[] {
  scanCounter += 1
  const s = scanCounter
  const known = (productId: string, qty: number, confidence: number): LineItem => {
    const p = productById(productId)!
    return {
      lineId: `L${s}-${productId}`,
      status: 'KNOWN',
      qty,
      productId,
      label: p.name,
      price: p.price,
      confidence,
    }
  }

  return [
    known('SKU-1004', 1, 0.98),
    known('SKU-1001', 2, 0.96),
    {
      lineId: `L${s}-amb1`,
      status: 'AMBIGUOUS',
      qty: 1,
      label: 'Masala snack packet',
      price: 0,
      confidence: 0.61,
      candidates: ['SKU-1003', 'SKU-1006'],
    },
    {
      lineId: `L${s}-amb2`,
      status: 'AMBIGUOUS',
      qty: 1,
      label: 'Amul carton',
      price: 0,
      confidence: 0.54,
      candidates: ['SKU-1002', 'SKU-1005'],
    },
    {
      lineId: `L${s}-unk1`,
      status: 'UNKNOWN',
      qty: 1,
      label: 'Unrecognized object',
      price: 0,
      confidence: 0.22,
    },
  ]
}

export function resolveToProduct(line: LineItem, productId: string): LineItem {
  const p = productById(productId)!
  return {
    ...line,
    status: 'KNOWN',
    productId,
    label: p.name,
    price: p.price,
    confidence: 1,
    candidates: undefined,
  }
}

export function lineTotal(line: LineItem): number {
  return line.price * line.qty
}
