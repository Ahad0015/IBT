import { useContext, useMemo, useState } from "react";
import { CartContext } from "../../CartProvider.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import SideBar from "../SideBar/SideBar.jsx";
import Dish from "./Dish/Dish.jsx";
import "./Menu.css";

const Menu = () => {
  const [category, setCategory] = useState("All");
  const { data, loading, error } = useFetch(`/api/dishes?c=${category}`);
  const { addItem } = useContext(CartContext);

  const shown = useMemo(
    () => (data ?? []).slice().sort((a, b) => b.price - a.price),
    [data]
  );

  return (
    <div className="menu-layout">
      <SideBar category={category} onSelect={setCategory} />

      <section className="menu">
        <div className="menu-title">Food Menu</div>

        {loading && <p className="menu-status">Loading the menu…</p>}
        {error && <p className="menu-status menu-error">Couldn't load the menu.</p>}

        {!loading && !error && (
          <div className="menu-grid">
            {shown.map((dish) => (
              <Dish key={dish.id} dish={dish} onAdd={addItem} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
