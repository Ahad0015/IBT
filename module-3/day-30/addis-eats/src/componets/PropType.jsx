// componets/PropType.jsx — shared shape checks
import PropTypes from "prop-types";

export const DishShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  tag: PropTypes.oneOf(["Veg", "Spicy", "Vegetarian"]),
  image: PropTypes.string,
});

export const CartItemShape = PropTypes.shape({
  cartId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
});
