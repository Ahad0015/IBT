import { memo } from "react";
import DishCard from "./DishCard";
import "./DishList.css";

// React.memo + a stable onAdd (useCallback in the parent) means this list
// is skipped when only the cart changes.
const DishList = memo(function DishList({ dishes, onAdd }) {
  return (
    <div className="dish-list">
      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          name={dish.name}
          price={dish.price}
          image={dish.image}
          spicy={dish.spicy}
          currency="ETB"
          to={`/menu/${dish.slug}`}
          onAdd={() => onAdd(dish)}
        />
      ))}
    </div>
  );
});

export default DishList;
