// Safe wrappers around localStorage / sessionStorage. Private windows and blocked
// storage can throw, and the app should keep working (just without persistence).

function make(store) {
  return {
    get(key, fallback = null) {
      try {
        const raw = store().getItem(key)
        return raw === null ? fallback : JSON.parse(raw)
      } catch {
        return fallback
      }
    },
    set(key, value) {
      try {
        store().setItem(key, JSON.stringify(value))
      } catch {
        /* storage unavailable: ignore */
      }
    },
    remove(key) {
      try {
        store().removeItem(key)
      } catch {
        /* ignore */
      }
    },
  }
}

export const local = make(() => window.localStorage)
export const session = make(() => window.sessionStorage)

export const KEYS = {
  dishes: 'addis-eats:dishes',
  orders: 'addis-eats:orders',
  ordersSeeded: 'addis-eats:orders-seeded',
  cart: 'addis-eats:cart',
  favorites: 'addis-eats:favorites',
  theme: 'addis-eats:theme',
  user: 'addis-eats:user',
  adminSession: 'addis-eats:admin-session',
}
