import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'
import CartBadge, { useCartLabel } from './cart/CartBadge'
import ThemeToggle from './theme/ThemeToggle'
import Icon from './ui/Icon'
import './Layout.css'

const NAV = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/menu', label: 'Menu', icon: 'menu' },
  { to: '/favorites', label: 'Favorites', icon: 'heart' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef(null)
  const firstRender = useRef(true)
  const cartLabel = useCartLabel()

  // On every route change: scroll to top and move focus to <main> so keyboard
  // and screen-reader users start at the new content, not at the old link.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Addis Eats, home">
            <img className="brand__logo" src="/logo.png" alt="" />
            <span className="brand__name">Addis Eats</span>
          </Link>
          <nav className="site-nav" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
            {user && <NavLink to="/orders">Orders</NavLink>}
          </nav>

          <div className="site-actions">
            <ThemeToggle />
            <Link to="/cart" className="icon-btn cart-link" aria-label={cartLabel}>
              <Icon name="cart" />
              <CartBadge />
            </Link>
            {user ? (
              <div className="account">
                <span className="account__name">Hi, {user.name.split(' ')[0]}</span>
                <button type="button" className="btn btn--secondary btn--sm" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="btn btn--sm account__signin">Sign in</Link>
            )}
          </div>
        </div>
        <div className="flag-stripe" aria-hidden="true" />
      </header>

      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <p className="site-footer__title">Addis Eats</p>
            <p className="muted">Ethiopian food, pizza, burgers and drinks, delivered across Addis Ababa. Pay in cash on delivery.</p>
          </div>
          <nav aria-label="Footer" className="site-footer__links">
            <Link to="/menu">Menu</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/admin/login">Staff login</Link>
          </nav>
        </div>
      </footer>

      {/* Mobile bottom navigation: thumb-reachable on phones */}
      <nav className="bottom-nav" aria-label="Quick links">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <NavLink to="/cart" aria-label={cartLabel}>
          <span className="bottom-nav__cart">
            <Icon name="cart" />
            <CartBadge />
          </span>
          <span>Cart</span>
        </NavLink>
        {user ? (
          <NavLink to="/orders">
            <Icon name="receipt" />
            <span>Orders</span>
          </NavLink>
        ) : (
          <NavLink to="/signin">
            <Icon name="user" />
            <span>Sign in</span>
          </NavLink>
        )}
      </nav>
    </>
  )
}
