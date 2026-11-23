import { createContext, useCallback, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { KEYS, session } from '../api/storage'

// Admin features 1, 2 and 17. The session is context + sessionStorage, so it
// survives a refresh but ends when the tab closes.
// Demo credentials: there is no server, so they are simply constants.
export const ADMIN_CREDENTIALS = { username: 'admin', password: 'addis2026' }

export const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => session.get(KEYS.adminSession))

  const login = useCallback((username, password) => {
    const ok =
      username.trim().toLowerCase() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
    if (!ok) return false
    const next = { username: ADMIN_CREDENTIALS.username, signedInAt: new Date().toISOString() }
    session.set(KEYS.adminSession, next)
    setAdmin(next)
    return true
  }, [])

  const logout = useCallback(() => {
    session.remove(KEYS.adminSession)
    setAdmin(null)
  }, [])

  const value = useMemo(() => ({ admin, login, logout }), [admin, login, logout])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

// Route element: provides admin auth to every /admin/* route and nothing else.
export function AdminAuthRoot() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}
