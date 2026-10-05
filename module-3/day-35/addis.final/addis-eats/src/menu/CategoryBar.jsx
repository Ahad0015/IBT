import "./CategoryBar.css";

function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="filters">
      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;