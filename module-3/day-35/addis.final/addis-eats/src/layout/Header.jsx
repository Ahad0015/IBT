import "./Header.css";
import CartBadge from "../cart/CartBadge";

// Header no longer reads the cart itself, so adding a dish never re-renders it.
function Header() {
  return (
    <header className="header">
      <h1>Addis Eats</h1>
      <p>Traditional Ethiopian Food</p>
      <CartBadge />
    </header>
  );
}

export default Header;
