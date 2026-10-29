import { Link, Route, Routes } from 'react-router-dom'
import { AdminAuthRoot } from './admin/AdminAuthContext'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import DishManager from './admin/DishManager'
import OrderManager from './admin/OrderManager'
import RequireAdmin from './admin/RequireAdmin'
import RequireAuth from './auth/RequireAuth'
import SignIn from './auth/SignIn'
import Cart from './cart/Cart'
import Checkout from './checkout/Checkout'
import Favorites from './favorites/Favorites'
import Home from './home/Home'
import Layout from './Layout'
import Dish from './menu/Dish'
import Menu from './menu/Menu'
import OrderHistory from './orders/OrderHistory'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'
import { useDocumentTitle } from './hooks/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="container page">
      <EmptyState icon="🧭" title="This page isn't on the menu" actions={<Button to="/">Back to home</Button>}>
        The link may be old or mistyped. Try the home page or browse the menu.
      </EmptyState>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Customer app: five required routes + favorites, orders and sign-in */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:id" element={<Dish />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="signin" element={<SignIn />} />

        {/* Guarded: signed-out visitors are redirected to /signin */}
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin extension: nested + guarded route group */}
      <Route path="admin" element={<AdminAuthRoot />}>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<DishManager />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
