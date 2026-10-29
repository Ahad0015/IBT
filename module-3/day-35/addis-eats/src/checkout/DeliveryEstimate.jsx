import Icon from '../ui/Icon'
import { estimatedArrival, formatEstimate, getDeliveryEstimate, getDeliveryFee } from '../utils/deliveryEstimate'
import { formatCurrency } from '../utils/formatCurrency'

// Features 20 + 21. Fee and time are *derived* from the chosen area, the items and
// the subtotal on every render. They are never stored on their own.
export function useDelivery(area, items, subtotal) {
  const fee = area ? getDeliveryFee(area, subtotal) : null
  const estimate = getDeliveryEstimate(area, items, (item) => item.prepMinutes ?? 15)
  return { fee, estimate, total: subtotal + (fee ?? 0) }
}

export default function DeliveryEstimate({ area, fee, estimate }) {
  if (!area) {
    return (
      <p className="delivery-note muted">
        <Icon name="pin" size={18} /> Choose your area to see the delivery fee and arrival time.
      </p>
    )
  }
  return (
    <div className="delivery-note delivery-note--ready" aria-live="polite">
      <p>
        <Icon name="clock" size={18} />
        <span>
          Arrives in about <strong>{formatEstimate(estimate)}</strong>, around {estimatedArrival(estimate)}.
        </span>
      </p>
      <p>
        <Icon name="pin" size={18} />
        <span>
          Delivery to {area}: <strong>{fee === 0 ? 'Free' : formatCurrency(fee)}</strong>
        </span>
      </p>
    </div>
  )
}
