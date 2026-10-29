import { useMemo, useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatOrderDate } from '../orders/OrderHistoryItem'
import { ORDER_STATUSES, STATUS_LABELS, useOrderStore } from '../orders/orderHistoryStore'
import StatusTracker from '../orders/StatusTracker'
import '../orders/orders.css'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPhone } from '../utils/validators'
import './admin.css'

const NEXT = { pending: 'preparing', preparing: 'delivering', delivering: 'delivered' }

// Admin features 11-14: list, update status, delete, details.
export default function OrderManager() {
  useDocumentTitle('Manage orders')
  const orders = useOrderStore((s) => s.orders)
  const updateStatus = useOrderStore((s) => s.updateStatus)
  const deleteOrder = useOrderStore((s) => s.deleteOrder)
  const { show } = useToast()

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [viewingId, setViewingId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const counts = useMemo(() => {
    const result = { all: orders.length }
    for (const s of ORDER_STATUSES) result[s] = orders.filter((o) => o.status === s).length
    return result
  }, [orders])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false
      if (!needle) return true
      return (
        o.id.toLowerCase().includes(needle) ||
        o.customer.name.toLowerCase().includes(needle) ||
        o.customer.phone.includes(needle.replace(/\s/g, ''))
      )
    })
  }, [orders, filter, query])

  // Read the open order from the store so the dialog always shows the latest status.
  const viewing = orders.find((o) => o.id === viewingId) ?? null

  function changeStatus(order, status) {
    updateStatus(order.id, status)
    show(`${order.id} is now ${STATUS_LABELS[status].toLowerCase()}`)
  }

  function confirmDelete() {
    deleteOrder(deleting.id)
    show(`${deleting.id} deleted`)
    if (viewingId === deleting.id) setViewingId(null)
    setDeleting(null)
  }

  return (
    <>
      <header className="admin__head">
        <h1>Orders</h1>
        <p className="muted">Move orders from the kitchen to the door, and keep the list tidy.</p>
      </header>

      <div className="order-tools">
        <div className="category-bar" role="group" aria-label="Filter by status">
          {['all', ...ORDER_STATUSES].map((s) => (
            <button key={s} type="button" className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : STATUS_LABELS[s]} <span className="count">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="order-search" className="sr-only">Search orders</label>
          <input
            id="order-search"
            type="search"
            className="input"
            placeholder="Search by order number, name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <p className="results-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'order' : 'orders'}</p>

      {orders.length === 0 && (
        <EmptyState icon="🧾" title="No orders yet">New orders from customers will appear here.</EmptyState>
      )}
      {orders.length > 0 && visible.length === 0 && (
        <EmptyState icon="🔍" title="No orders match" actions={<Button onClick={() => { setFilter('all'); setQuery('') }}>Show all orders</Button>}>
          Try another status or a different search.
        </EmptyState>
      )}

      {visible.length > 0 && (
        <div className="table-wrap card">
          <table className="table">
            <caption className="sr-only">Customer orders</caption>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Placed</th>
                <th scope="col" className="num">Total</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <th scope="row">{order.id}</th>
                  <td data-label="Customer">
                    {order.customer.name}
                    <span className="muted table__sub">{order.customer.area}</span>
                  </td>
                  <td data-label="Placed">{formatOrderDate(order.createdAt)}</td>
                  <td data-label="Total" className="num price">{formatCurrency(order.total)}</td>
                  <td data-label="Status">
                    <label className="sr-only" htmlFor={`status-${order.id}`}>Status for {order.id}</label>
                    <select
                      id={`status-${order.id}`}
                      className={`input status-select badge--${order.status}`}
                      value={order.status}
                      onChange={(e) => changeStatus(order, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td className="table__actions">
                    <Button variant="secondary" size="sm" onClick={() => setViewingId(order.id)} aria-label={`View details for ${order.id}`}>Details</Button>
                    <Button variant="secondary" size="sm" className="btn--danger-text" onClick={() => setDeleting(order)} aria-label={`Delete ${order.id}`}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <Modal title={`Order ${viewing.id}`} onClose={() => setViewingId(null)} wide>
          <div className="detail-top">
            <span className={`badge badge--${viewing.status}`}>{STATUS_LABELS[viewing.status]}</span>
            <span className="muted">Placed {formatOrderDate(viewing.createdAt)}</span>
          </div>
          <StatusTracker status={viewing.status} />

          <dl className="detail-grid">
            <div><dt>Customer</dt><dd>{viewing.customer.name}</dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${viewing.customer.phone}`}>{formatPhone(viewing.customer.phone)}</a></dd></div>
            <div><dt>Delivery area</dt><dd>{viewing.customer.area}{viewing.customer.address ? `, ${viewing.customer.address}` : ''}</dd></div>
            <div><dt>Payment</dt><dd>Cash on delivery</dd></div>
          </dl>

          <ul className="mini-list">
            {viewing.items.map((item) => (
              <li key={item.id}>
                <span aria-hidden="true">{item.emoji}</span>
                <span>{item.qty} × {item.name}</span>
                <span className="price">{formatCurrency(item.price * item.qty)}</span>
              </li>
            ))}
            <li><span /><span className="muted">Subtotal</span><span className="price">{formatCurrency(viewing.subtotal)}</span></li>
            <li><span /><span className="muted">Delivery</span><span className="price">{viewing.deliveryFee === 0 ? 'Free' : formatCurrency(viewing.deliveryFee)}</span></li>
            <li className="mini-list__total"><span /><span>Total</span><span className="price">{formatCurrency(viewing.total)}</span></li>
          </ul>

          {viewing.note && <p className="order__note"><strong>Customer note:</strong> {viewing.note}</p>}

          <div className="modal__foot">
            <Button variant="secondary" className="btn--danger-text" onClick={() => setDeleting(viewing)}>Delete order</Button>
            {NEXT[viewing.status] ? (
              <Button onClick={() => changeStatus(viewing, NEXT[viewing.status])} data-autofocus>
                Mark as {STATUS_LABELS[NEXT[viewing.status]].toLowerCase()}
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setViewingId(null)} data-autofocus>Close</Button>
            )}
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title={`Delete ${deleting.id}?`} onClose={() => setDeleting(null)}>
          <p>This permanently removes the order from the system, including the customer's order history.</p>
          <div className="modal__foot">
            <Button variant="secondary" onClick={() => setDeleting(null)} data-autofocus>Keep order</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete order</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
