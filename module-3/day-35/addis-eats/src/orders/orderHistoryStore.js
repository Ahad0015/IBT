import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { KEYS, local } from '../api/storage'

export const ORDER_STATUSES = ['pending', 'preparing', 'delivering', 'delivered']

export const STATUS_LABELS = {
  pending: 'Order received',
  preparing: 'Being prepared',
  delivering: 'On the way',
  delivered: 'Delivered',
}

function makeOrderId(existing) {
  const highest = existing.reduce((max, o) => {
    const n = Number(String(o.id).replace('AE-', ''))
    return Number.isFinite(n) ? Math.max(max, n) : max
  }, 1000)
  return `AE-${highest + 1}`
}

// One persisted list of orders. The customer's OrderHistory filters it by phone;
// the admin screens read and edit all of it (admin features 11-15).
export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Appended after a successful checkout. Returns the saved order.
      addOrder: (order) => {
        const saved = {
          ...order,
          id: makeOrderId(get().orders),
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ orders: [saved, ...state.orders] }))
        return saved
      },

      updateStatus: (id, status) =>
        set((state) => ({ orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),

      deleteOrder: (id) => set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),

      // Admin data seeding: runs once, never overwrites real orders.
      seed: (sampleOrders) => {
        if (local.get(KEYS.ordersSeeded)) return
        local.set(KEYS.ordersSeeded, true)
        set((state) => ({
          orders: [...state.orders, ...sampleOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        }))
      },
    }),
    { name: KEYS.orders, version: 1 },
  ),
)
