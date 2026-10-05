import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../ui/Spinner";

// Guard: renders what it wraps, or redirects to /login remembering where
// the person was headed so Login can send them back.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While the session is still being read, user is null - don't redirect yet,
  // or a signed-in person is bounced to /login on every refresh.
  if (loading) return <Spinner label="Checking your session…" />;

  if (!user) {
    // <Navigate> (not navigate()) keeps rendering pure; replace keeps /checkout
    // out of the history so Back doesn't return to the page that rejected them.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
