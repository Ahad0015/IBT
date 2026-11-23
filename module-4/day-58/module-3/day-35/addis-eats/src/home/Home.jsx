import { Link } from 'react-router-dom'
import { getDishes } from '../api/dishes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import DishList, { DishGridSkeleton } from '../menu/DishList'
import '../menu/menu.css'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import { FREE_DELIVERY_THRESHOLD } from '../utils/deliveryEstimate'
import { formatCurrency } from '../utils/formatCurrency'
import './home.css'

const CATEGORY_TILES = [
  { name: 'Ethiopian', emoji: '🍲', blurb: 'Wat, tibs, kitfo and fasting platters' },
  { name: 'Pizza', emoji: '🍕', blurb: 'Stone-baked, with an Addis twist' },
  { name: 'Burgers', emoji: '🍔', blurb: 'Smashed patties and spicy chicken' },
  { name: 'Drinks', emoji: '☕', blurb: 'Buna, shai, spris and fresh juice' },
]

const STEPS = [
  { title: 'Pick your dishes', text: 'Browse the menu, search by ingredient and save favorites for later.' },
  { title: 'Tell us where', text: 'Choose your area at checkout to see the delivery fee and time before you order.' },
  { title: 'Pay at the door', text: 'Your order arrives hot and you pay in cash on delivery. No card needed.' },
]

export default function Home() {
  useDocumentTitle('')
  const { data: dishes, loading, error, reload } = useFetch(getDishes)
  const specials = (dishes ?? []).filter((d) => d.special).slice(0, 4)

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__glyph" aria-hidden="true">አዲስ</div>
        <img className="hero__img" src="/images/hero.jpg" alt="" fetchpriority="high" />
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__inner">
          <p className="hero__welcome" lang="am">እንኳን ደህና መጡ</p>
          <h1 id="hero-title">Hungry in Addis? Dinner is already on its way.</h1>
          <p className="hero__lede">
            Doro wat, kitfo, pizza, burgers and cold spris juice, delivered across twelve neighborhoods of Addis Ababa.
          </p>
          <div className="hero__cta">
            <Button to="/menu" size="lg" className="hero__btn">Browse the menu</Button>
            <a href="#specials" className="btn btn--lg btn--secondary hero__btn-alt">See today's specials</a>
          </div>
          <ul className="hero__facts">
            <li><strong>30–55 min</strong> delivery</li>
            <li><strong>{formatCurrency(FREE_DELIVERY_THRESHOLD)}+</strong> ships free</li>
            <li><strong>Cash</strong> on delivery</li>
          </ul>
        </div>
      </section>

      <div className="container home">
        <section id="specials" aria-labelledby="specials-title" className="home__section">
          <div className="section-head">
            <h2 id="specials-title">Today's specials</h2>
            <Link to="/menu" className="section-link">View the full menu</Link>
          </div>
          {loading && <DishGridSkeleton count={4} />}
          {error && <ErrorState title="We couldn't load today's specials" error={error} onRetry={reload} />}
          {!loading && !error && specials.length > 0 && <DishList dishes={specials} />}
          {!loading && !error && specials.length === 0 && (
            <p className="muted">No specials today. The full menu is ready when you are.</p>
          )}
        </section>

        <section aria-labelledby="cats-title" className="home__section">
          <h2 id="cats-title">Order by craving</h2>
          <ul className="tiles">
            {CATEGORY_TILES.map((tile) => (
              <li key={tile.name}>
                <Link to={`/menu?category=${tile.name}`} className="tile" data-category={tile.name}>
                  <span className="tile__emoji" aria-hidden="true">{tile.emoji}</span>
                  <span className="tile__name">{tile.name}</span>
                  <span className="tile__blurb">{tile.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-title" className="home__section">
          <h2 id="how-title">How ordering works</h2>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="step card pad">
                <span className="step__num" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
