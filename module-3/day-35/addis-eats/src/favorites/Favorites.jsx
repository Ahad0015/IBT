import { getDishes } from '../api/dishes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import DishList, { DishGridSkeleton } from '../menu/DishList'
import '../menu/menu.css'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import { useFavoritesStore } from './favoritesStore'

// Feature 17: saved dishes, toggled from the heart on any DishCard.
export default function Favorites() {
  useDocumentTitle('Favorites')
  const ids = useFavoritesStore((s) => s.ids)
  const { data: dishes, loading, error, reload } = useFetch(getDishes)
  const saved = (dishes ?? []).filter((dish) => ids.includes(dish.id))

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Your favorites</h1>
        <p>Dishes you have saved with the heart. They are kept in this browser.</p>
      </div>

      {loading && <DishGridSkeleton count={4} />}
      {error && <ErrorState title="We couldn't load your favorites" error={error} onRetry={reload} />}
      {!loading && !error && saved.length === 0 && (
        <EmptyState
          icon="💚"
          title="No favorites yet"
          actions={<Button to="/menu">Find something you love</Button>}
        >
          Tap the heart on any dish and it will wait for you here.
        </EmptyState>
      )}
      {!loading && !error && saved.length > 0 && <DishList dishes={saved} />}
    </div>
  )
}
