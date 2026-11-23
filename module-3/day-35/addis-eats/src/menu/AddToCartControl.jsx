import { useEffect, useRef } from 'react'
import { useCartStore, selectQty } from '../cart/cartStore'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Stepper from '../ui/Stepper'
import { useToast } from '../ui/Toast'

// "Add" turns into a +/- stepper once the dish is in the cart (features 4, 5).
// After the first add, keyboard focus moves onto the stepper so it isn't lost
// when the Add button disappears.
export default function AddToCartControl({ dish }) {
  const qty = useCartStore(selectQty(dish.id))
  const addItem = useCartStore((s) => s.addItem)
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const { show } = useToast()
  const wrapRef = useRef(null)
  const focusAfterAdd = useRef(false)

  useEffect(() => {
    if (qty > 0 && focusAfterAdd.current) {
      focusAfterAdd.current = false
      wrapRef.current?.querySelector('button:last-of-type')?.focus()
    }
  }, [qty])

  if (qty === 0) {
    return (
      <Button
        size="sm"
        onClick={() => {
          focusAfterAdd.current = true
          addItem(dish)
          show(`${dish.name} added to your cart`)
        }}
        aria-label={`Add ${dish.name} to cart`}
      >
        <Icon name="plus" size={18} /> Add
      </Button>
    )
  }

  return (
    <div ref={wrapRef}>
      <Stepper
        value={qty}
        label={dish.name}
        onIncrement={() => increment(dish.id)}
        onDecrement={() => decrement(dish.id)}
      />
    </div>
  )
}
