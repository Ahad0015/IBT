import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { KEYS } from '../api/storage'

// The cart is read by Menu, Dish, Cart, Checkout and the header badge, so it
// lives in a store (features 4-8). `persist` mirrors it to localStorage, which
// is what lets the cart survive a refresh (feature 8).
export const useCartStore = create(
  persist(
    (set) => ({
      items: [], // { id, name, emoji, category, price, prepMinutes, image, qty }

      addItem: (dish, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === dish.id)
          if (existing) {
            return {
              items: state.items.map((i) => (i.id === dish.id ? { ...i, qty: Math.min(20, i.qty + qty) } : i)),
            }
          }
          const { id, name, emoji, category, price, prepMinutes, image } = dish
          return { items: [...state.items, { id, name, emoji, category, price, prepMinutes, image, qty }] }
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty: Math.min(20, i.qty + 1) } : i)),
        })),

      // Going below 1 removes the line, so the "−" button never leaves a 0-quantity row.
      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: KEYS.cart, version: 1 },
  ),
)

// Derived values: computed from the items, never stored on their own.
export const selectCount = (state) => state.items.reduce((sum, i) => sum + i.qty, 0)
export const selectSubtotal = (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
export const selectQty = (id) => (state) => state.items.find((i) => i.id === id)?.qty ?? 0