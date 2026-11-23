import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { estimatedArrival, formatEstimate } from '../utils/deliveryEstimate'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPhone } from '../utils/validators'

// Feature 11: shown in place of the form after the order is saved.
export default function OrderConfirmation({ order }) {
  return (
    <div className="confirmation card pad" role="status">
      <div className="confirmation__check" aria-hidden="true">
        <Icon name="check" size={40} />
      </div>
      <h1 tabIndex={-1} data-autofocus>Thank you, {order.customer.name.split(' ')[0]}. Your order is in.</h1>
      <p className="confirmation__id">
        Order number <strong>{order.id}</strong>
      </p>
      <p className="muted">
        The kitchen has it now. We will call {formatPhone(order.customer.phone)} if we need anything.
      </p>

      <dl className="confirmation__facts">
        <div>
          <dt>Arrives in</dt>
          <dd>{formatEstimate(order.eta)}<span className="muted"> · about {estimatedArrival(order.eta, new Date(order.createdAt))}</span></dd>
        </div>
        <div>
          <dt>Delivering to</dt>
          <dd>{order.customer.area}{order.customer.address ? `, ${order.customer.address}` : ''}</dd>
        </div>
        <div>
          <dt>Pay at the door</dt>
          <dd>{formatCurrency(order.total)} in cash</dd>
        </div>
      </dl>

      <ul className="confirmation__items">
        {order.items.map((item) => (
          <li key={item.id}>
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.qty} × {item.name}</span>
            <span className="price">{formatCurrency(item.price * item.qty)}</span>
          </li>
        ))}
        <li className="confirmation__fee">
          <span />
          <span>Delivery</span>
          <span className="price">{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
        </li>
      </ul>

      {order.note && (
        <p className="confirmation__note"><strong>Your note:</strong> {order.note}</p>
      )}

      <div className="confirmation__actions">
        <Button to="/orders">Track in order history</Button>
        <Button to="/menu" variant="secondary">Order something else</Button>
      </div>
    </div>
  )
}
