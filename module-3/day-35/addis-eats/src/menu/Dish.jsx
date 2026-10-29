import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDish, getDishes } from '../api/dishes'
import { useCartStore } from '../cart/cartStore'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import Icon from '../ui/Icon'
import Spinner from '../ui/Spinner'
import Stepper from '../ui/Stepper'
import { useToast } from '../ui/Toast'
import { formatCurrency } from '../utils/formatCurrency'
import DishCard from './DishCard'
import DishImage from './DishImage'
import DishTags from './DishTags'
import FavoriteButton from '../favorites/FavoriteButton'
import './menu.css'

export default function Dish() {
  const { id } = useParams()
  const { data: dish, loading, error, reload } = useFetch(() => getDish(id), [id])
  const { data: all } = useFetch(getDishes)
  useDocumentTitle(dish?.name ?? 'Dish')

  if (loading) {
    return (
      <div className="container page" style={{ display: 'grid', placeItems: 'center', minHeight: 360 }}>
        <Spinner label="Loading dish" />
      </div>
    )
  }

  if (error) {
    const notFound = error.code === 'NOT_FOUND'
    return (
      <div className="container page">
        <ErrorState
          title={notFound ? 'Dish not found' : "We couldn't load this dish"}
          error={error}
          onRetry={notFound ? undefined : reload}
        >
          <Button variant="secondary" to="/menu">Back to the menu</Button>
        </ErrorState>
      </div>
    )
  }

  const related = (all ?? []).filter((d) => d.category === dish.category && d.id !== dish.id).slice(0, 3)

  return (
    <div className="container page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to="/menu">Menu</Link>
        <Icon name="chevron" size={16} />
        <Link to={`/menu?category=${dish.category}`}>{dish.category}</Link>
        <Icon name="chevron" size={16} />
        <span aria-current="page">{dish.name}</span>
      </nav>

      <DishDetail key={dish.id} dish={dish} />

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <h2 id="related-title">More from {dish.category}</h2>
          <ul className="dish-grid">
            {related.map((d) => (
              <li key={d.id}><DishCard dish={d} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// Quantity chosen here is local to this screen: nobody else needs it (feature 18).
function DishDetail({ dish }) {
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const { show } = useToast()

  return (
    <article className="dish-detail">
      <div className="dish-art dish-art--large" data-category={dish.category}>
        <DishImage dish={dish} alt={dish.name} />
        {dish.special && <span className="dish-card__special">Today's special</span>}
      </div>

      <div className="dish-detail__info">
        <div className="dish-detail__title">
          <h1>{dish.name}</h1>
          <FavoriteButton dish={dish} />
        </div>
        <DishTags dish={dish} />
        <p className="dish-detail__desc">{dish.description}</p>

        <section aria-labelledby="ingredients-title">
          <h2 id="ingredients-title" className="h-small">Ingredients</h2>
          <ul className="ingredients">
            {dish.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <p className="prep">
          <Icon name="clock" size={18} /> Ready in about {dish.prepMinutes} minutes
        </p>

        <div className="dish-detail__buy">
          <Stepper
            value={qty}
            label={dish.name}
            onIncrement={() => setQty((q) => Math.min(20, q + 1))}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
          />
          <Button
            size="lg"
            onClick={() => {
              addItem(dish, qty)
              show(`${qty} × ${dish.name} added to your cart`)
              setQty(1)
            }}
          >
            Add to cart · {formatCurrency(dish.price * qty)}
          </Button>
        </div>
        <Button variant="ghost" to="/cart" className="dish-detail__cartlink">Go to cart</Button>
      </div>
    </article>
  )
}