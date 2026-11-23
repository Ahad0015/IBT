import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { selectSubtotal, useCartStore } from '../cart/cartStore'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useOrderStore } from '../orders/orderHistoryStore'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Spinner from '../ui/Spinner'
import { AREA_NAMES, DELIVERY_AREAS } from '../utils/deliveryEstimate'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPhone, normalizePhone } from '../utils/validators'
import DeliveryEstimate, { useDelivery } from './DeliveryEstimate'
import Field from './Field'
import OrderConfirmation from './OrderConfirmation'
import { NOTE_MAX, validateCheckout, validateField } from './validate'
import './checkout.css'

const EMPTY_TOUCHED = {}

export default function Checkout() {
  useDocumentTitle('Checkout')
  const { user } = useAuth()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectSubtotal)
  const clearCart = useCartStore((s) => s.clear)
  const addOrder = useOrderStore((s) => s.addOrder)

  // Form fields (including special instructions) live here and nowhere else.
  const [values, setValues] = useState({
    name: user?.name ?? '',
    phone: user?.phone ? formatPhone(user.phone) : '',
    area: '',
    address: '',
    note: '',
  })
  const [touched, setTouched] = useState(EMPTY_TOUCHED)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  // Derived, never stored (features 20, 21)
  const { fee, estimate, total } = useDelivery(values.area, items, subtotal)

  // Scroll the confirmation into view and announce it.
  useEffect(() => {
    if (placedOrder) {
      window.scrollTo(0, 0)
      document.querySelector('[data-autofocus]')?.focus({ preventScroll: true })
    }
  }, [placedOrder])

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    // Once a field has been visited, re-check it as the customer types.
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }))
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateCheckout(values)
    setErrors(found)
    setTouched({ name: true, phone: true, area: true, address: true, note: true })

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700)) // stands in for the network call
    const order = addOrder({
      userPhone: normalizePhone(user?.phone ?? values.phone) || values.phone,
      customer: {
        name: values.name.trim(),
        phone: normalizePhone(values.phone),
        area: values.area,
        address: values.address.trim(),
      },
      items,
      subtotal,
      deliveryFee: fee,
      total,
      note: values.note.trim(),
      eta: estimate,
    })
    clearCart()
    setPlacedOrder(order)
    setSubmitting(false)
  }

  if (placedOrder) {
    return (
      <div className="container page page--narrow">
        <OrderConfirmation order={placedOrder} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState
          icon="🛒"
          title="Nothing to check out yet"
          actions={<Button to="/menu">Browse the menu</Button>}
        >
          Add some dishes to your cart first, then come back to place your order.
        </EmptyState>
      </div>
    )
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Checkout</h1>
        <p>Tell us where to bring your food. You pay in cash when it arrives.</p>
      </div>

      <div className="checkout-layout">
        <form className="card pad checkout-form" onSubmit={handleSubmit} noValidate aria-describedby={errorCount ? 'form-summary' : undefined}>
          {errorCount > 0 && (
            <p id="form-summary" className="form-summary" role="alert">
              {errorCount === 1 ? 'One field needs your attention.' : `${errorCount} fields need your attention.`}
            </p>
          )}

          <fieldset className="fieldset">
            <legend>Who is this for?</legend>
            <div className="form-grid form-grid--2">
              <Field
                label="Full name"
                name="name"
                required
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                placeholder="Selam Tadesse"
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                hint="The rider calls this number on arrival."
                placeholder="0911 223 344"
              />
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend>Where should we bring it?</legend>
            <div className="form-grid form-grid--2">
              <Field
                as="select"
                label="Delivery area"
                name="area"
                required
                value={values.area}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.area}
              >
                <option value="">Choose your area</option>
                {AREA_NAMES.map((area) => (
                  <option key={area} value={area}>
                    {area} · {formatCurrency(DELIVERY_AREAS[area].fee)}
                  </option>
                ))}
              </Field>
              <Field
                label="Street or landmark"
                name="address"
                autoComplete="street-address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address}
                placeholder="Near Edna Mall, blue gate"
              />
            </div>
            <DeliveryEstimate area={values.area} fee={fee} estimate={estimate} />
          </fieldset>

          <fieldset className="fieldset">
            <legend>Anything we should know?</legend>
            <Field
              as="textarea"
              label="Special instructions"
              name="note"
              rows={3}
              maxLength={NOTE_MAX + 20}
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.note}
              hint="Allergies, extra spicy, ring the bell twice."
              placeholder="Please make the doro wat extra spicy."
              counter={
                <p className={`counter${values.note.length > NOTE_MAX ? ' counter--over' : ''}`} aria-hidden="true">
                  {values.note.length}/{NOTE_MAX}
                </p>
              }
            />
          </fieldset>

          <div className="payment-note">
            <span aria-hidden="true">💵</span>
            <p><strong>Cash on delivery.</strong> Please have {formatCurrency(total)} ready when your order arrives.</p>
          </div>

          <Button type="submit" size="lg" block disabled={submitting}>
            {submitting ? <Spinner small label="Placing your order" /> : null}
            {submitting ? 'Placing your order' : `Place order · ${formatCurrency(total)}`}
          </Button>
        </form>

        <aside className="card pad checkout-summary" aria-labelledby="co-summary">
          <h2 id="co-summary">Your order</h2>
          <ul className="mini-list">
            {items.map((item) => (
              <li key={item.id}>
                <span aria-hidden="true">{item.emoji}</span>
                <span>{item.qty} × {item.name}</span>
                <span className="price">{formatCurrency(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd className="price">{formatCurrency(subtotal)}</dd></div>
            <div>
              <dt>Delivery</dt>
              <dd className={fee === null ? 'muted' : 'price'}>
                {fee === null ? 'Choose an area' : fee === 0 ? 'Free' : formatCurrency(fee)}
              </dd>
            </div>
          </dl>
          <div className="totals totals--grand" aria-live="polite">
            <span>Total</span>
            <span className="price">{formatCurrency(total)}</span>
          </div>
          <Button to="/cart" variant="ghost" size="sm">Edit cart</Button>
        </aside>
      </div>
    </div>
  )
}
