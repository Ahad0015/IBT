import { useContext } from "react";
import { CartContext } from "../CartProvider.jsx";
import Menu from "./Menu/Menu.jsx";
import "./Main.css";

const Main = () => {
  const { items, total, removeItem, clearCart } = useContext(CartContext);

  return (
    <main className="main">
      <Menu />
      {items.length > 0 && (
        <section className="cart-strip">
          <div className="cart-items">
            {items.map((item) => (
              <span key={item.cartId} className="cart-chip">
                {item.name} · {item.price} ETB
                <button onClick={() => removeItem(item.cartId)}>×</button>
              </span>
            ))}
          </div>
          <div className="cart-total">
            <span>Total: {total} ETB</span>
            <button onClick={clearCart}>Clear cart</button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Main;
