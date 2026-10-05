import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// The guarded front door for the session context: a clear error beats a
// null crash somewhere unrelated when the provider is missing.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
