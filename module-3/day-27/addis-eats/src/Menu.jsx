import PropTypes from "prop-types";
import Dish from "./Dish";
import { dishes } from "./data";

function Menu({ category }) {
  const filtered = dishes.filter((d) => d.category === category);

  if (filtered.length === 0) {
    return <p>No dishes found in "{category}".</p>;
  }

  return (
    <div>
      {filtered.map((d) => (
        <Dish key={d.id} name={d.name} price={d.price} spicy={d.spicy} />
      ))}
    </div>
  );
}

Menu.propTypes = {
  category: PropTypes.string.isRequired,
};

export default Menu;