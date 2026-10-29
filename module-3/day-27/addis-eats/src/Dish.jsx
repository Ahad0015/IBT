import PropTypes from "prop-types";
import Card from "./Card";

function Dish({ name, price, spicy, currency }) {
  return (
    <Card>
      <h3>{name}</h3>
      <p>{price} {currency}</p>
      {spicy === true && (
        <span style={{ background: "#c0392b", color: "#fff", padding: "2px 8px", borderRadius: 4 }}>
          🌶 Spicy
        </span>
      )}
    </Card>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
};

Dish.defaultProps = {
  currency: "ETB",
};

export default Dish;