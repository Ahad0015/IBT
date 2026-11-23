import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

// Route guard (Day 31). Signed-out visitors are sent to /signin and returned to
// the page they wanted afterwards.
export default function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
