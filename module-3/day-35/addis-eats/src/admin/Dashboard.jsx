import { useMemo } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ORDER_STATUSES, STATUS_LABELS, useOrderStore } from '../orders/orderHistoryStore'
import EmptyState from '../ui/EmptyState'
import { formatCurrency } from '../utils/formatCurrency'
import './admin.css'

const STATUS_COLORS = {
  pending: 'var(--saffron-500)',
  preparing: '#3b6fd4',
  delivering: '#8b4fc2',
  delivered: '#17a05f',
}

// Admin features 3, 4 and 5. Everything is derived from the orders store.
export default function Dashboard() {
  useDocumentTitle('Dashboard')
  const orders = useOrderStore((s) => s.orders)

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + o.total, 0)
    const average = orders.length ? revenue / orders.length : 0

    const byDish = new Map()
    for (const order of orders) {
      for (const item of order.items) {
        const row = byDish.get(item.id) ?? { id: item.id, name: item.name, emoji: item.emoji, qty: 0, revenue: 0 }
        row.qty += item.qty
        row.revenue += item.qty * item.price
        byDish.set(item.id, row)
      }
    }
    const top = [...byDish.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)

    const statusCounts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0]))
    for (const order of orders) statusCounts[order.status] += 1

    // Revenue for each of the last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (6 - i))
      return { date: d, total: 0 }
    })
    for (const order of orders) {
      const created = new Date(order.createdAt)
      created.setHours(0, 0, 0, 0)
      const day = days.find((d) => d.date.getTime() === created.getTime())
      if (day) day.total += order.total
    }

    return { revenue, average, top, statusCounts, days }
  }, [orders])

  if (orders.length === 0) {
    return (
      <>
        <header className="admin__head"><h1>Dashboard</h1></header>
        <EmptyState icon="📊" title="No orders yet">
          Once customers place orders, revenue and top dishes will show up here.
        </EmptyState>
      </>
    )
  }

  const maxQty = Math.max(...stats.top.map((t) => t.qty), 1)
  const maxDay = Math.max(...stats.days.map((d) => d.total), 1)

  return (
    <>
      <header className="admin__head">
        <h1>Dashboard</h1>
        <p className="muted">How the kitchen is doing across all orders.</p>
      </header>

      <section aria-label="Key numbers" className="kpis">
        <div className="kpi card">
          <p className="kpi__label">Revenue</p>
          <p className="kpi__value">{formatCurrency(stats.revenue)}</p>
        </div>
        <div className="kpi card">
          <p className="kpi__label">Orders</p>
          <p className="kpi__value">{orders.length}</p>
        </div>
        <div className="kpi card">
          <p className="kpi__label">Average order</p>
          <p className="kpi__value">{formatCurrency(Math.round(stats.average))}</p>
        </div>
      </section>

      <div className="dash-grid">
        <section className="card pad" aria-labelledby="top-title">
          <h2 id="top-title" className="h-small">Top selling dishes</h2>
          <ol className="top-list">
            {stats.top.map((dish) => (
              <li key={dish.id}>
                <span className="top-list__name"><span aria-hidden="true">{dish.emoji}</span> {dish.name}</span>
                <span className="top-list__bar" aria-hidden="true"><span style={{ width: `${(dish.qty / maxQty) * 100}%` }} /></span>
                <span className="top-list__qty"><strong>{dish.qty}</strong> sold</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card pad" aria-labelledby="status-title">
          <h2 id="status-title" className="h-small">Order status</h2>
          <div className="statusbar" role="img" aria-label={ORDER_STATUSES.map((s) => `${stats.statusCounts[s]} ${STATUS_LABELS[s].toLowerCase()}`).join(', ')}>
            {ORDER_STATUSES.map((s) =>
              stats.statusCounts[s] ? (
                <span key={s} style={{ flexGrow: stats.statusCounts[s], background: STATUS_COLORS[s] }} />
              ) : null,
            )}
          </div>
          <ul className="legend">
            {ORDER_STATUSES.map((s) => (
              <li key={s}>
                <span className="legend__dot" style={{ background: STATUS_COLORS[s] }} aria-hidden="true" />
                <span>{STATUS_LABELS[s]}</span>
                <strong>{stats.statusCounts[s]}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="card pad dash-grid__wide" aria-labelledby="week-title">
          <h2 id="week-title" className="h-small">Revenue, last 7 days</h2>
          <ul className="bars">
            {stats.days.map((day) => (
              <li key={day.date.toISOString()}>
                <span className="bars__value">{day.total ? formatCurrency(day.total) : '–'}</span>
                <span className="bars__col" aria-hidden="true"><span style={{ height: `${(day.total / maxDay) * 100}%` }} /></span>
                <span className="bars__label">{day.date.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
