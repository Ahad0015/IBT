import { memo } from "react";
import { DishShape } from "../../../PropType.jsx";
import "./Dish.css";

const Dish = memo(function Dish({ dish, onAdd }) {
  const isSpicy = dish.tag === "Spicy";

  return (
    <article className="dish-card" onClick={() => onAdd(dish)} title="Click to add to cart">
      <img className="dish-image" src="/food-image.jpg" alt="Food Image" />

      <div className="dish-info">
        <div className="dish-meta">
          <span className="dish-category">{dish.category}</span>
          {isSpicy ? (
            <span className="dish-spicy">🌶 Spicy</span>
          ) : (
            <span className="dish-vegetarian">Vegetarian</span>
          )}
        </div>

        <div className="dish-bottom">
          <span className="dish-name">{dish.name}</span>
          <span className="dish-price">{dish.price}</span>
        </div>
      </div>
    </article>
  );
});

Dish.propTypes = { dish: DishShape };

export default Dish;
