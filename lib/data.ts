export type Category =
  | 'Beverages'
  | 'Snacks'
  | 'Dairy'
  | 'Produce'
  | 'Instant Foods'

export type Product = {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  stock: number
  aisle: string
  image: string
}

export const CATEGORIES: Category[] = [
  'Beverages',
  'Snacks',
  'Dairy',
  'Produce',
  'Instant Foods',
]

export const PRODUCTS: Product[] = [
  {
    id: 'SKU-1001',
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestlé',
    category: 'Instant Foods',
    price: 14,
    stock: 48,
    aisle: 'Aisle 3 - Bay A',
    image: '/products/sku-1001.png',
  },
  {
    id: 'SKU-1002',
    name: 'Amul Taaza Milk 500ml',
    brand: 'Amul',
    category: 'Dairy',
    price: 72,
    stock: 6,
    aisle: 'Aisle 5 - Bay B',
    image: '/products/sku-1002.png',
  },
  {
    id: 'SKU-1003',
    name: "Lay's India's Magic Masala",
    brand: "Lay's",
    category: 'Snacks',
    price: 20,
    stock: 32,
    aisle: 'Aisle 2 - Bay C',
    image: '/products/sku-1003.png',
  },
  {
    id: 'SKU-1004',
    name: 'Coca-Cola 750ml',
    brand: 'Coca-Cola',
    category: 'Beverages',
    price: 40,
    stock: 60,
    aisle: 'Aisle 1 - Bay A',
    image: '/products/sku-1004.png',
  },
  {
    id: 'SKU-1005',
    name: 'Amul Butter 100g',
    brand: 'Amul',
    category: 'Dairy',
    price: 55,
    stock: 9,
    aisle: 'Aisle 5 - Bay A',
    image: '/products/sku-1005.png',
  },
  {
    id: 'SKU-1006',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure',
    category: 'Snacks',
    price: 20,
    stock: 25,
    aisle: 'Aisle 2 - Bay D',
    image: '/products/sku-1006.png',
  },
  {
    id: 'SKU-1007',
    name: 'Thums Up 750ml',
    brand: 'Thums Up',
    category: 'Beverages',
    price: 40,
    stock: 44,
    aisle: 'Aisle 1 - Bay B',
    image: '/products/sku-1007.png',
  },
  {
    id: 'SKU-1008',
    name: 'Britannia Good Day',
    brand: 'Britannia',
    category: 'Snacks',
    price: 30,
    stock: 18,
    aisle: 'Aisle 2 - Bay A',
    image: '/products/sku-1008.png',
  },
  {
    id: 'SKU-1009',
    name: 'Tata Tea Gold 250g',
    brand: 'Tata',
    category: 'Beverages',
    price: 135,
    stock: 12,
    aisle: 'Aisle 1 - Bay D',
    image: '/products/sku-1009.png',
  },
  {
    id: 'SKU-1010',
    name: 'Fresh Bananas (dozen)',
    brand: 'Farm Fresh',
    category: 'Produce',
    price: 50,
    stock: 8,
    aisle: 'Aisle 6 - Bay A',
    image: '/products/sku-1010.png',
  },
  {
    id: 'SKU-1011',
    name: 'Onion 1kg',
    brand: 'Farm Fresh',
    category: 'Produce',
    price: 35,
    stock: 40,
    aisle: 'Aisle 6 - Bay B',
    image: '/products/sku-1011.png',
  },
  {
    id: 'SKU-1012',
    name: 'Top Ramen Curry',
    brand: 'Nissin',
    category: 'Instant Foods',
    price: 15,
    stock: 10,
    aisle: 'Aisle 3 - Bay B',
    image: '/products/sku-1012.png',
  },
]

export const GST_RATE = 0.05

export function formatINR(value: number): string {
  return `₹${value.toFixed(2)}`
}

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

/* ---------- Frequently bought combos (customer assistant) ---------- */

export type Combo = {
  id: string
  title: string
  reason: string
  productIds: string[]
}

export const COMBOS: Combo[] = [
  {
    id: 'combo-chai',
    title: 'Evening Chai Break',
    reason: 'Bought together by 8 of 10 shoppers buying tea',
    productIds: ['SKU-1009', 'SKU-1002', 'SKU-1008'],
  },
  {
    id: 'combo-latenight',
    title: 'Late-Night Snack Run',
    reason: 'Popular after 9 PM near the campus store',
    productIds: ['SKU-1001', 'SKU-1003', 'SKU-1004'],
  },
  {
    id: 'combo-breakfast',
    title: 'Quick Breakfast Basket',
    reason: 'Frequently reordered on weekday mornings',
    productIds: ['SKU-1002', 'SKU-1005', 'SKU-1010'],
  },
]

export function comboTotal(combo: Combo): number {
  return combo.productIds.reduce((sum, id) => sum + (productById(id)?.price ?? 0), 0)
}

/* ---------- Analytics mock data ---------- */

export type SaleTxn = {
  id: string
  time: string
  items: number
  method: 'Cash' | 'UPI' | 'Card'
  total: number
}

export const RECENT_SALES: SaleTxn[] = [
  { id: 'TXN-48210', time: '18:42', items: 6, method: 'UPI', total: 284 },
  { id: 'TXN-48209', time: '18:37', items: 3, method: 'Card', total: 132 },
  { id: 'TXN-48208', time: '18:31', items: 9, method: 'Cash', total: 511 },
  { id: 'TXN-48207', time: '18:24', items: 2, method: 'UPI', total: 74 },
  { id: 'TXN-48206', time: '18:19', items: 5, method: 'UPI', total: 218 },
  { id: 'TXN-48205', time: '18:11', items: 4, method: 'Card', total: 165 },
  { id: 'TXN-48204', time: '18:03', items: 7, method: 'Cash', total: 392 },
  { id: 'TXN-48203', time: '17:56', items: 1, method: 'UPI', total: 40 },
]
