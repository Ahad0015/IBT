import { Link } from "react-router-dom";

// Used by the "*" route AND by DishDetail when a valid path has an unknown id.
function NotFound({ message = "That page does not exist." }) {
  return (
    <section className="panel">
      <h2>Not found</h2>
      <p>{message}</p>
      <Link to="/menu">Back to the menu</Link>
    </section>
  );
}

export default NotFound;
