import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Field from '../checkout/Field'
import '../checkout/checkout.css'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../ui/Button'
import { formatPhone, normalizePhone, validateName, validatePhone } from '../utils/validators'
import { useAuth } from './useAuth'
import './auth.css'

// Customer sign-in. Checkout and order history are guarded, so this is where
// RequireAuth sends signed-out visitors (and where they return from).
export default function SignIn() {
  useDocumentTitle('Sign in')
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/menu'

  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})

  if (user) return <Navigate to={from} replace />

  function validate(vals) {
    const result = {}
    const name = validateName(vals.name)
    const phone = validatePhone(vals.phone)
    if (name) result.name = name
    if (phone) result.phone = phone
    return result
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }
    signIn({ name: values.name.trim(), phone: normalizePhone(values.phone) })
    navigate(from, { replace: true })
  }

  return (
    <div className="container page auth-page">
      <form className="card pad auth-card" onSubmit={handleSubmit} noValidate>
        <div>
          <h1>Sign in to order</h1>
          <p className="muted">
            {from === '/checkout'
              ? 'Almost there. Sign in so we know who to call about your order.'
              : 'Your name and number keep your orders and reorders together.'}
          </p>
        </div>
        <Field
          label="Full name"
          name="name"
          required
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          onBlur={() => setErrors((prev) => ({ ...prev, name: validate(values).name }))}
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
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          onBlur={() => setErrors((prev) => ({ ...prev, phone: validate(values).phone }))}
          error={errors.phone}
          hint={values.phone && !validatePhone(values.phone) ? `We'll save it as ${formatPhone(values.phone)}` : 'An Ethiopian mobile number, like 0911 223 344.'}
          placeholder="0911 223 344"
        />
        <Button type="submit" size="lg" block>Continue</Button>
        <p className="muted auth-note">Demo sign-in: no password needed. Your details stay in this browser.</p>
      </form>
    </div>
  )
}
