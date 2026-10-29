import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getDishes } from '../api/dishes'
import { useDebounce } from '../hooks/useDebounce'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Icon from '../ui/Icon'
import CategoryBar, { CATEGORIES } from './CategoryBar'
import DishList, { DishGridSkeleton } from './DishList'
import './menu.css'

const SORTS = {
  recommended: { label: 'Recommended', fn: null },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function Menu() {
  useDocumentTitle('Menu')
  const [params, setParams] = useSearchParams()

  // Features 1, 12, 14: fetched here, in the component that displays the dishes.
  const { data: dishes, loading, error, reload } = useFetch(getDishes)

  // Feature 3: the category is in the URL, so it is shareable and survives refresh.
  const rawCategory = params.get('category') || ''
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : ''
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'recommended'

  // Feature 2: the input filters on every keystroke; the URL catches up after a short pause.
  const [query, setQuery] = useState(params.get('q') || '')
  const debouncedQuery = useDebounce(query, 300)
  useEffect(() => {
    updateParams({ q: debouncedQuery.trim() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  function updateParams(changes) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  }

  const counts = useMemo(() => {
    const result = {}
    for (const dish of dishes ?? []) result[dish.category] = (result[dish.category] ?? 0) + 1
    return result
  }, [dishes])

  const visible = useMemo(() => {
    if (!dishes) return []
    const needle = query.trim().toLowerCase()
    let list = dishes.filter((dish) => {
      if (category && dish.category !== category) return false
      if (!needle) return true
      return (
        dish.name.toLowerCase().includes(needle) ||
        dish.description.toLowerCase().includes(needle) ||
        dish.ingredients.some((ingredient) => ingredient.toLowerCase().includes(needle))
      )
    })
    const sorter = SORTS[sort].fn
    if (sorter) list = [...list].sort(sorter)
    return list
  }, [dishes, category, query, sort])

  function clearFilters() {
    setQuery('')
    setParams({}, { replace: true })
  }

  const filtering = Boolean(category || query.trim())

  return (
    <div className="container page">
      <div className="page-head">
        <h1>The menu</h1>
        <p>Cooked fresh in Addis Ababa and delivered hot. Search by dish or ingredient, or pick a category.</p>
      </div>

      <div className="menu-tools">
        <div className="search">
          <label htmlFor="menu-search" className="sr-only">Search dishes</label>
          <Icon name="search" size={20} className="search__icon" />
          <input
            id="menu-search"
            type="search"
            className="input search__input"
            placeholder="Search dishes or ingredients, like “lentil”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="sort">
          <label htmlFor="menu-sort" className="sr-only">Sort dishes</label>
          <select
            id="menu-sort"
            className="input"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value === 'recommended' ? '' : e.target.value })}
          >
            {Object.entries(SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <CategoryBar selected={category} counts={counts} onSelect={(name) => updateParams({ category: name })} />

      <p className="results-count" aria-live="polite">
        {loading ? '' : error ? '' : `${visible.length} ${visible.length === 1 ? 'dish' : 'dishes'}${category ? ` in ${category}` : ''}`}
      </p>

      {loading && <DishGridSkeleton />}

      {error && <ErrorState title="We couldn't load the menu" error={error} onRetry={reload} />}

      {!loading && !error && dishes.length === 0 && (
        <EmptyState icon="🍽️" title="The menu is empty right now">
          The kitchen hasn't published any dishes yet. Check back soon.
        </EmptyState>
      )}

      {!loading && !error && dishes.length > 0 && visible.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No dishes match your search"
          actions={<Button onClick={clearFilters}>Clear search and filters</Button>}
        >
          {query.trim() ? `Nothing found for “${query.trim()}”` : 'Nothing in this category'}
          {filtering ? '. Try a different word or category.' : '.'}
        </EmptyState>
      )}

      {!loading && !error && visible.length > 0 && <DishList dishes={visible} />}
    </div>
  )
}
