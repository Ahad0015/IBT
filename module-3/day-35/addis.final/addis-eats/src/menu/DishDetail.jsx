import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { DISHES_URL } from "../api/dishes";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import Spinner from "../ui/Spinner";
import ErrorNote from "../ui/ErrorNote";
import NotFound from "../pages/NotFound";
import Button from "../ui/Button";

// Route: /menu/:id  - here the id is the dish's slug, e.g. /menu/shiro
function DishDetail() {
  const { id } = useParams(); // always a string
  const { data, loading, error } = useFetch(DISHES_URL);
  const addItem = useCartStore((s) => s.addItem);

  const dish = useMemo(
    () => (data ?? []).find((d) => d.slug === id),
    [data, id]
  );

  // Loading, error, empty, data - in that order.
  if (loading) return <Spinner label="Loading the dish…" />;
  if (error) return <ErrorNote what="this dish" message={error} />;
  // A valid path with an unknown id still matches "menu/:id", so we notice here.
  if (!dish) return <NotFound message={`No dish called ${id}`} />;

  return (
    <article className="detail">
      <Link to="/menu">← Back to the menu</Link>
      <img src={dish.image} alt={dish.name} />
      <h1>{dish.name}</h1>
      <p className="detail-meta">
        {dish.price} ETB · {dish.category}
        {dish.spicy && " · 🌶️ Spicy"}
      </p>
      <p>{dish.description}</p>
      <Button text="Add to cart" onClick={() => addItem(dish)} />
    </article>
  );
}

export default DishDetail;
