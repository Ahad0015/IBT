import { useContext } from "react";
import { CartContext } from "../CartProvider.jsx";
import "./Header.css";

const Header = () => {
  const { items } = useContext(CartContext);

  return (
    <header className="header">
      <h1>Header</h1>
      <div className="header-cart">Cart {items.length}</div>
    </header>
  );
};

export default Header;
