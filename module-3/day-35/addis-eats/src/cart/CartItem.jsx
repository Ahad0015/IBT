import { Link } from 'react-router-dom'
import DishImage from '../menu/DishImage'
import Icon from '../ui/Icon'
import Stepper from '../ui/Stepper'
import { formatCurrency } from '../utils/formatCurrency'
import { useCartStore } from './cartStore'

export default function CartItem({ item }) {
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <li className="cart-item">
      <div className="cart-item__art dish-art" data-category={item.category} aria-hidden="true">
        <DishImage dish={item} />
      </div>
      <div className="cart-item__info">
        <h3><Link to={`/menu/${item.id}`}>{item.name}</Link></h3>
        <p className="muted">{formatCurrency(item.price)} each</p>
      </div>
      <div className="cart-item__controls">
        <Stepper
          value={item.qty}
          label={item.name}
          onIncrement={() => increment(item.id)}
          onDecrement={() => decrement(item.id)}
        />
        <button
          type="button"
          className="icon-btn cart-item__remove"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          title="Remove"
        >
          <Icon name="trash" size={20} />
        </button>
      </div>
      <p className="price cart-item__total">{formatCurrency(item.price * item.qty)}</p>
    </li>
  )
}