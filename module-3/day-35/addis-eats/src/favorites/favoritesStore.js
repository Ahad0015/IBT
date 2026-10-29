import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { KEYS } from '../api/storage'

// Feature 17: favorite dish IDs, persisted to localStorage. Read by every
// DishCard heart and by the Favorites screen.
export const useFavoritesStore = create(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
    }),
    { name: KEYS.favorites, version: 1 },
  ),
)
