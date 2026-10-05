import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import "./DishCard.css";
import Button from "../ui/Button";

function DishCard({ name, price, spicy = false, currency = "ETB", image, to, onAdd }) {
  const heading = (
    <>
      <img src={image} alt={name} />
      <h2>{name}</h2>
    </>
  );

  return (
    <Card>
      <div className="dish">
        {to ? (
          <Link to={to} className="dish-link">
            {heading}
          </Link>
        ) : (
          heading
        )}

        <p>
          {price} {currency}
        </p>

        {spicy && <span className="spicy">🌶️ Spicy</span>}

        <Button text="Add to cart" onClick={onAdd} />
      </div>
    </Card>
  );
}

DishCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  image: PropTypes.string,
  to: PropTypes.string,
  onAdd: PropTypes.func,
};

export default DishCard;
