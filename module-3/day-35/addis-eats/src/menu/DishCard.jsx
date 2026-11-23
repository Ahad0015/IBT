import { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import AddToCartControl from './AddToCartControl'
import FavoriteButton from '../favorites/FavoriteButton'
import DishImage from './DishImage'
import DishTags from './DishTags'

function DishCard({ dish }) {
  return (
    <article className="dish-card">
      <div className="dish-art" data-category={dish.category}>
        {/* The image is decorative, so the title link is the single tab stop */}
        <Link to={`/menu/${dish.id}`} className="dish-art__link" tabIndex={-1} aria-hidden="true">
          <DishImage dish={dish} />
        </Link>
        <FavoriteButton dish={dish} className="dish-card__fav" />
        {dish.special && <span className="dish-card__special">Today's special</span>}
      </div>

      <div className="dish-card__body">
        <div className="dish-card__top">
          <h3 className="dish-card__title">
            <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>
          <DishTags dish={dish} compact />
        </div>
        <p className="dish-card__desc">{dish.description}</p>
        <div className="dish-card__foot">
          <span className="price">{formatCurrency(dish.price)}</span>
          <AddToCartControl dish={dish} />
        </div>
      </div>
    </article>
  )
}

export default memo(DishCard)