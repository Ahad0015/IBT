import DishCard from './DishCard'

export default function DishList({ dishes }) {
  return (
    <ul className="dish-grid">
      {dishes.map((dish) => (
        <li key={dish.id}>
          <DishCard dish={dish} />
        </li>
      ))}
    </ul>
  )
}

// Loading placeholder with the same footprint as a card (feature 12).
export function DishGridSkeleton({ count = 8 }) {
  return (
    <div role="status" aria-label="Loading the menu">
      <ul className="dish-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="dish-card dish-card--skeleton">
            <div className="skeleton" style={{ aspectRatio: '16 / 10', borderRadius: 0 }} />
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              <div className="skeleton" style={{ height: 20, width: '60%' }} />
              <div className="skeleton" style={{ height: 14 }} />
              <div className="skeleton" style={{ height: 14, width: '80%' }} />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading the menu…</span>
    </div>
  )
}
