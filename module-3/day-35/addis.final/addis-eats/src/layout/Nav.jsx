import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useTheme } from "../theme/useTheme";
import "./Nav.css";

const linkClass = ({ isActive }) => (isActive ? "on" : "");

function Nav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav">
      {/* end: "/" would otherwise match every URL and always look active */}
      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/menu" className={linkClass}>Menu</NavLink>
      <NavLink to="/cart" className={linkClass}>Cart</NavLink>
      <NavLink to="/checkout" className={linkClass}>Checkout</NavLink>

      <span className="nav-spacer" />

      <button className="nav-btn" onClick={toggleTheme}>
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      {user ? (
        <button className="nav-btn" onClick={logout}>
          Sign out ({user.phone})
        </button>
      ) : (
        <NavLink to="/login" className={linkClass}>Sign in</NavLink>
      )}
    </nav>
  );
}

export default Nav;
