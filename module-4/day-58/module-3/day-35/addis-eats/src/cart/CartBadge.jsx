import { useCartStore, selectCount } from './cartStore'

// Feature 24: the badge has no state of its own. It reads the count from the cart store.
export default function CartBadge() {
  const count = useCartStore(selectCount)
  if (count === 0) return null
  return (
    <span className="cart-badge" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  )
}

// Screen-reader text lives with the link, so it can say "3 items".
export function useCartLabel() {
  const count = useCartStore(selectCount)
  return count === 0 ? 'Cart, empty' : `Cart, ${count} ${count === 1 ? 'item' : 'items'}`
}
