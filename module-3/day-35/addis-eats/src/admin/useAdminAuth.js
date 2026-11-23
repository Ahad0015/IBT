import { useContext } from 'react'
import { AdminAuthContext } from './AdminAuthContext'

// Admin feature 2: session management hook.
export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside the /admin route group')
  return ctx
}
