import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { fetchSampleOrders } from '../api/orders'
import { useOrderStore } from '../orders/orderHistoryStore'
import ThemeToggle from '../theme/ThemeToggle'
import Icon from '../ui/Icon'
import { useAdminAuth } from './useAdminAuth'
import './admin.css'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: 'chart', end: true },
  { to: '/admin/menu', label: 'Menu', icon: 'menu' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt' },
]

// Nested layout: sidebar + <Outlet /> (Day 31).
export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const seed = useOrderStore((s) => s.seed)
  const mainRef = useRef(null)
  const first = useRef(true)

  // Admin feature 16: on first run, load demo orders from menu-data.json.
  useEffect(() => {
    fetchSampleOrders().then(seed).catch(() => {})
  }, [seed])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  // Admin feature 17: end the session and return to the login screen.
  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin">
      <a className="skip-link" href="#admin-main">Skip to content</a>
      <aside className="admin__side">
        <div className="admin__brand">
          <img className="brand__logo" src="/logo.png" alt="" />
          <div>
            <p className="admin__brand-name">Addis Eats</p>
            <p className="admin__brand-sub">Staff</p>
          </div>
        </div>

        <nav aria-label="Admin" className="admin__nav">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <Icon name={link.icon} size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
          <NavLink to="/" className="admin__store-link">
            <Icon name="store" size={20} />
            <span>View store</span>
          </NavLink>
        </nav>

        <div className="admin__user">
          <p className="admin__who">Signed in as <strong>{admin.username}</strong></p>
          <div className="admin__user-actions">
            <ThemeToggle />
            <button type="button" className="btn btn--secondary btn--sm admin__logout" onClick={handleLogout}>
              <Icon name="logout" size={18} /> Log out
            </button>
          </div>
        </div>
      </aside>

      <main id="admin-main" ref={mainRef} tabIndex={-1} className="admin__main">
        <Outlet />
      </main>
    </div>
  )
}
