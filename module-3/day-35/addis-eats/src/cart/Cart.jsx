import { useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Modal from '../ui/Modal'
import { FREE_DELIVERY_THRESHOLD } from '../utils/deliveryEstimate'
import { formatCurrency } from '../utils/formatCurrency'
import CartItem from './CartItem'
import { selectCount, selectSubtotal, useCartStore } from './cartStore'
import './cart.css'

export default function Cart() {
  useDocumentTitle('Your cart')
  const items = useCartStore((s) => s.items)
  const count = useCartStore(selectCount)
  const subtotal = useCartStore(selectSubtotal) // feature 7: recalculated from the store on every change
  const clear = useCartStore((s) => s.clear)
  const [confirmClear, setConfirmClear] = useState(false) // modal state lives with the component that opens it

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          actions={<Button to="/menu">Browse the menu</Button>}
        >
          Add a dish or two and it will show up here. Your cart is saved, so it will wait for you.
        </EmptyState>
      </div>
    )
  }

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Your cart</h1>
        <p>{count} {count === 1 ? 'item' : 'items'} from our kitchen.</p>
      </div>

      <div className="cart-layout">
        <section aria-label="Items in your cart">
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
          <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
            Clear cart
          </Button>
        </section>

        <aside className="cart-summary card pad" aria-labelledby="summary-title">
          <h2 id="summary-title">Order summary</h2>

          <div className="free-ship">
            <p aria-live="polite">
              {remaining === 0
                ? 'You get free delivery on this order.'
                : <>Add <strong>{formatCurrency(remaining)}</strong> more for free delivery.</>}
            </p>
            <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress to free delivery">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="totals">
            <div><dt>Subtotal</dt><dd className="price">{formatCurrency(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd className="muted">Calculated at checkout</dd></div>
          </dl>
          <div className="totals totals--grand" aria-live="polite">
            <span>Total so far</span>
            <span className="price">{formatCurrency(subtotal)}</span>
          </div>

          <Button to="/checkout" size="lg" block>Go to checkout</Button>
          <Button to="/menu" variant="secondary" block>Add more dishes</Button>
        </aside>
      </div>

      {confirmClear && (
        <Modal title="Clear your cart?" onClose={() => setConfirmClear(false)}>
          <p>This removes all {count} items from your cart.</p>
          <div className="modal__foot">
            <Button variant="secondary" onClick={() => setConfirmClear(false)} data-autofocus>Keep items</Button>
            <Button
              variant="danger"
              onClick={() => {
                clear()
                setConfirmClear(false)
              }}
            >
              Clear cart
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
