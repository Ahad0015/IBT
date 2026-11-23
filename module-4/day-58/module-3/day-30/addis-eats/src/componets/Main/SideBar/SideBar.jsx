import PropTypes from "prop-types";
import "./SideBar.css";

const CATEGORIES = ["All", "Main", "Vegetarian", "Breakfast"];

const SideBar = ({ category, onSelect }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">SideBar</div>
      <nav className="sidebar-nav">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            className={item === category ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
};

SideBar.propTypes = {
  category: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SideBar;
