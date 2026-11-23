import { createContext, useCallback, useMemo, useState } from 'react'
import { KEYS, local } from '../api/storage'

// Customer sign-in session. It rarely changes and the route guard needs it,
// so it lives in context. There is no real backend: signing in records a name
// and phone number, which also tie orders to this customer.
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => local.get(KEYS.user))

  const signIn = useCallback((profile) => {
    local.set(KEYS.user, profile)
    setUser(profile)
  }, [])

  const signOut = useCallback(() => {
    local.remove(KEYS.user)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
