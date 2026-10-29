import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Field from '../checkout/Field'
import '../checkout/checkout.css'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../ui/Button'
import { ADMIN_CREDENTIALS } from './AdminAuthContext'
import { useAdminAuth } from './useAdminAuth'
import './admin.css'

// Admin feature 1.
export default function AdminLogin() {
  useDocumentTitle('Staff sign in')
  const { admin, login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'
  const [values, setValues] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  if (admin) return <Navigate to={from} replace />

  function handleSubmit(event) {
    event.preventDefault()
    if (!values.username.trim() || !values.password) {
      setError('Enter both your username and password.')
      document.getElementById(values.username.trim() ? 'field-password' : 'field-username')?.focus()
      return
    }
    if (login(values.username, values.password)) {
      navigate(from, { replace: true })
    } else {
      setError('That username and password do not match. Check them and try again.')
      document.getElementById('field-password')?.focus()
    }
  }

  return (
    <div className="admin-login">
      <form className="card pad admin-login__card" onSubmit={handleSubmit} noValidate>
        <img className="admin-login__logo" src="/logo.png" alt="" />
        <div>
          <h1>Staff sign in</h1>
          <p className="muted">Manage the menu and orders for Addis Eats.</p>
        </div>
        {error && <p className="form-summary" role="alert">{error}</p>}
        <Field
          label="Username"
          name="username"
          required
          autoComplete="username"
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <Button type="submit" size="lg" block>Sign in</Button>
        <p className="admin-login__demo">
          Demo credentials: <code>{ADMIN_CREDENTIALS.username}</code> / <code>{ADMIN_CREDENTIALS.password}</code>
        </p>
        <Link to="/" className="admin-login__back">Back to the store</Link>
      </form>
    </div>
  )
}
