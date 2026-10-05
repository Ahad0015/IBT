import { Link } from "react-router-dom";
import { useCartStore, selectCount } from "./cartStore";

// Subscribes to ONE number. It re-renders when the count changes and for
// nothing else - and nothing above it (Header, Layout) re-renders at all.
function CartBadge() {
  const count = useCartStore(selectCount);

  return (
    <Link
      to="/cart"
      className="cart-badge"
      aria-label={`${count} items in cart`}
    >
      🛒 {count}
    </Link>
  );
}

export default CartBadge;
