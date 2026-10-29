import { useFavoritesStore } from './favoritesStore'
import Icon from '../ui/Icon'

// Feature 17: heart toggle used on every DishCard and on the Dish screen.
export default function FavoriteButton({ dish, className = '' }) {
  const isFavorite = useFavoritesStore((s) => s.ids.includes(dish.id))
  const toggle = useFavoritesStore((s) => s.toggle)
  return (
    <button
      type="button"
      className={`fav-btn${isFavorite ? ' is-on' : ''} ${className}`}
      onClick={() => toggle(dish.id)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Save ${dish.name} to favorites`}
    >
      <Icon name="heart" size={22} filled={isFavorite} />
    </button>
  )
}
