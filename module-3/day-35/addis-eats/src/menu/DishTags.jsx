const SPICE = ['Not spicy', 'Mild', 'Medium', 'Hot']

export default function DishTags({ dish, compact = false }) {
  return (
    <ul className="dish-tags" aria-label="Dish details">
      {dish.vegan && <li className="tag tag--vegan">Vegan</li>}
      {dish.spicy > 0 && (
        <li className="tag tag--spicy">
          <span aria-hidden="true">{'🌶'.repeat(dish.spicy)}</span>
          <span className={compact ? 'sr-only' : ''}>{SPICE[dish.spicy]}</span>
        </li>
      )}
    </ul>
  )
}
