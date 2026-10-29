import PropTypes from "prop-types";

function Card({ children }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, margin: 8 }}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
};

export default Card;