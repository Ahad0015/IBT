import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDishes } from '../api/dishes'
import { useCartStore } from '../cart/cartStore'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { useToast } from '../ui/Toast'
import { formatCurrency } from '../utils/formatCurrency'
import { STATUS_LABELS } from './orderHistoryStore'
import StatusTracker from './StatusTracker'

export function formatOrderDate(iso) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export default function OrderHistoryItem({ order }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const panelId = useId()
  const addItem = useCartStore((s) => s.addItem)
  const navigate = useNavigate()
  const { show } = useToast()

  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0)

  // Feature 19: one click. Looks each dish up again so prices are current and
  // dishes the kitchen has removed are skipped (and reported).
  async function reorder() {
    setBusy(true)
    try {
      const menu = await getDishes()
      const byId = new Map(menu.map((d) => [d.id, d]))
      let added = 0
      const missing = []
      for (const line of order.items) {
        const dish = byId.get(line.id)
        if (dish) {
          addItem(dish, line.qty)
          added += 1
        } else {
          missing.push(line.name)
        }
      }
      if (added === 0) {
        show('None of those dishes are on the menu any more.', { type: 'error' })
        return
      }
      show(missing.length ? `Added ${added} dishes. No longer available: ${missing.join(', ')}.` : `Added ${order.id} to your cart`)
      navigate('/cart')
    } catch {
      show('We could not reorder right now. Please try again.', { type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="order card">
      <div className="order__head">
        <div>
          <h2 className="order__id">{order.id}</h2>
          <p className="muted">{formatOrderDate(order.createdAt)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
        <span className={`badge badge--${order.status}`}>{STATUS_LABELS[order.status]}</span>
      </div>

      <p className="order__summary">
        {order.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}
      </p>

      <div className="order__foot">
        <span className="price">{formatCurrency(order.total)}</span>
        <div className="order__actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Hide details' : 'View details'}
            <Icon name="chevron" size={16} className={open ? 'rot-90' : ''} />
          </button>
          <Button size="sm" onClick={reorder} disabled={busy} aria-label={`Reorder ${order.id}`}>
            {busy ? 'Adding…' : 'Reorder'}
          </Button>
        </div>
      </div>

      <div id={panelId} hidden={!open} className="order__details">
        <StatusTracker status={order.status} />
        <ul className="mini-list">
          {order.items.map((item) => (
            <li key={item.id}>
              <span aria-hidden="true">{item.emoji}</span>
              <span>{item.qty} × {item.name}</span>
              <span className="price">{formatCurrency(item.price * item.qty)}</span>
            </li>
          ))}
          <li>
            <span />
            <span className="muted">Delivery to {order.customer.area}</span>
            <span className="price">{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
          </li>
        </ul>
        {order.note && <p className="order__note"><strong>Your note:</strong> {order.note}</p>}
      </div>
    </li>
  )
}
