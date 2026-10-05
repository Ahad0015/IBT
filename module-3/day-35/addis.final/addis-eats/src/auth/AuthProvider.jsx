import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { TELEBIRR, normalizePhone } from "../checkout/validate";

const STORAGE_KEY = "addis-eats-user";

async function readSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null; // unreadable or blocked storage: treat as signed out
  }
}

// Holds who is signed in. The session is read from localStorage AFTER the
// first render, so `loading` is true until we know - the guard must wait for it.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Async on purpose: a real app would ask the server "who am I?" here.
    readSession().then((saved) => {
      if (cancelled) return;
      setUser(saved);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (phone) => {
    // One rule for the whole app: 09… or +2519…, spaces and dashes forgiven.
    const clean = normalizePhone(phone);
    if (!TELEBIRR.test(clean)) {
      throw new Error("Use 09… or +2519… (TeleBirr number)");
    }
    const next = { phone: clean };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // still signed in for this session even if it can't be saved
    }
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
