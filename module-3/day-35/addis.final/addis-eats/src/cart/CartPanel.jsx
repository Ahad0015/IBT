import { Link } from "react-router-dom";
import { useCartStore, selectTotal } from "./cartStore";
import "./CartPanel.css";

function CartPanel() {
  // Narrow selectors, one value at a time.
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  return (
    <section className="cart panel">
      <h2>Shopping Cart</h2>

      {items.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <Link to="/menu">Browse the menu</Link>
        </>
      ) : (
        <>
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <p>
                {item.name} - {item.qty} x {item.price} ETB
              </p>
              <button onClick={() => remove(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: {total} ETB</h3>

          <div className="cart-actions">
            <button onClick={clear}>Clear cart</button>
            <Link to="/checkout" className="checkout-link">
              Go to checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPanel;
