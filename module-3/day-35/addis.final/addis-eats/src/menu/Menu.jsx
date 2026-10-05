import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DISHES_URL } from "../api/dishes";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import "./Menu.css";

function Menu() {
  // The filter is state that belongs in the address bar: /menu?category=Meat
  // is shareable and survives a refresh. (The cart does NOT belong there.)
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "All";

  const { data, loading, error } = useFetch(DISHES_URL);
  // One value, one selector. Store actions never change identity, so this
  // component does not re-render when the cart changes - and the memoised
  // DishList below gets a stable onAdd for free (no useCallback needed).
  const addItem = useCartStore((s) => s.addItem);

  const categories = useMemo(
    () => ["All", ...new Set((data ?? []).map((dish) => dish.category))],
    [data]
  );

  const shown = useMemo(
    () =>
      [...(data ?? [])]
        .filter((dish) => category === "All" || dish.category === category)
        .sort((a, b) => a.price - b.price),
    [data, category]
  );

  function choose(next) {
    // "All" is the default, so keep the URL clean: /menu
    setParams(next === "All" ? {} : { category: next });
  }

  return (
    <section className="menu">
      <h1>Addis Eats Menu</h1>

      <CategoryBar categories={categories} selected={category} onSelect={choose} />

      {loading && <Spinner label="Loading the menu…" />}
      {error && <ErrorNote what="the menu" message={error} />}
      {!loading && !error &&
        (shown.length === 0 ? (
          <p>No dishes found in this category.</p>
        ) : (
          <DishList dishes={shown} onAdd={addItem} />
        ))}
    </section>
  );
}

export default Menu;
