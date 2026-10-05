import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { DISHES_URL } from "../api/dishes";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import DishList from "../menu/DishList";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";

// Index route: the landing page at "/".
function Home() {
  const location = useLocation();
  const { data, loading, error } = useFetch(DISHES_URL);
  const addItem = useCartStore((s) => s.addItem);

  const specials = useMemo(
    () => (data ?? []).filter((dish) => dish.special),
    [data]
  );
  return (
    <section>
      {location.state?.orderPlaced && (
        <p role="status" className="notice">
          ✅ Order placed - thank you!
          {location.state.orderId && ` Your order number is ${location.state.orderId}.`}
          {" "}Your food is on its way.
        </p>
      )}

      <h1>Welcome to Addis Eats</h1>
      <p>Traditional Ethiopian food, delivered across Addis Ababa.</p>

      <h2>Today's specials</h2>
      {loading && <Spinner label="Loading today's specials…" />}
      {error && <ErrorNote what="the menu" message={error} />}
      {!loading && !error && <DishList dishes={specials} onAdd={addItem} />}

      <p>
        <Link to="/menu">See the full menu →</Link>
      </p>
    </section>
  );
}

export default Home;
