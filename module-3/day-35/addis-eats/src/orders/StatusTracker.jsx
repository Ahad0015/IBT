import { ORDER_STATUSES, STATUS_LABELS } from './orderHistoryStore'

// A four-step progress line for an order. Also used in admin order details.
export default function StatusTracker({ status }) {
  const current = ORDER_STATUSES.indexOf(status)
  return (
    <ol className="tracker" aria-label={`Order status: ${STATUS_LABELS[status]}`}>
      {ORDER_STATUSES.map((step, index) => (
        <li
          key={step}
          className={index < current ? 'is-done' : index === current ? 'is-current' : ''}
          aria-current={index === current ? 'step' : undefined}
        >
          <span className="tracker__dot" aria-hidden="true" />
          <span className="tracker__label">{STATUS_LABELS[step]}</span>
        </li>
      ))}
    </ol>
  )
}
