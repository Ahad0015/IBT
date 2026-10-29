import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'

// Guards the whole /admin group except /admin/login.
export default function RequireAdmin() {
  const { admin } = useAdminAuth()
  const location = useLocation()
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
