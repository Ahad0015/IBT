import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

// The whole cart: state and actions together, in a plain module.
// No Provider, no reducer file, no action-type strings.
export const useCartStore = create()(
  devtools(
    persist(
      (set) => ({
        items: [],

        // set() receives a function when the next state depends on the last.
        // The third argument just labels the action in the devtools.
        addItem: (dish) =>
          set(
            (state) => {
              const existing = state.items.find((item) => item.id === dish.id);

              if (existing) {
                return {
                  items: state.items.map((item) =>
                    item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
                  ),
                };
              }

              return { items: [...state.items, { ...dish, qty: 1 }] };
            },
            false,
            "cart/addItem"
          ),

        remove: (id) =>
          set(
            (state) => ({ items: state.items.filter((item) => item.id !== id) }),
            false,
            "cart/remove"
          ),

        // set() merges, so { items: [] } leaves every other key untouched.
        clear: () => set({ items: [] }, false, "cart/clear"),
      }),
      {
        name: "addis-eats-cart", // localStorage key: the order survives a refresh
        version: 1,
        // Explicit storage: zustand's default reaches for window.localStorage,
        // which does not exist outside a browser (tests, server rendering).
        storage: createJSONStorage(() => localStorage),
        // Save the data only. Functions are never serialised anyway,
        // but being explicit keeps it obvious what is persisted.
        partialize: (state) => ({ items: state.items }),
      }
    ),
    {
      name: "addis-eats-cart",
      enabled: import.meta.env?.DEV ?? false, // devtools in development only
    }
  )
);

// Derived values live in selectors, not in the store, so they can never
// be out of date. Both return a number, so the "did it change?" check is cheap.
export const selectTotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const selectCount = (state) =>
  state.items.reduce((sum, item) => sum + item.qty, 0);
