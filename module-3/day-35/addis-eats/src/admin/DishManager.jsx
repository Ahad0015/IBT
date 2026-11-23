import { useMemo, useState } from 'react'
import { createDish, deleteDish, getDishes, resetDishes, updateDish } from '../api/dishes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useFetch } from '../hooks/useFetch'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Icon from '../ui/Icon'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { useToast } from '../ui/Toast'
import { formatCurrency } from '../utils/formatCurrency'
import DishForm from './DishForm'
import './admin.css'

// Admin features 6-10: view, add, edit, delete (with confirmation) and search.
export default function DishManager() {
  useDocumentTitle('Manage menu')
  const { data: dishes, loading, error, reload } = useFetch(getDishes)
  const { show } = useToast()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | dish
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return dishes ?? []
    return (dishes ?? []).filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.category.toLowerCase().includes(needle) ||
        d.ingredients.some((i) => i.toLowerCase().includes(needle)),
    )
  }, [dishes, query])

  async function save(values) {
    setSaving(true)
    try {
      if (editing === 'new') {
        await createDish(values)
        show(`${values.name} added to the menu`)
      } else {
        await updateDish(editing.id, values)
        show(`${values.name} updated`)
      }
      setEditing(null)
      reload()
    } catch {
      show('We could not save that dish. Please try again.', { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    const dish = deleting
    await deleteDish(dish.id)
    setDeleting(null)
    show(`${dish.name} deleted`)
    reload()
  }

  async function restoreDefaults() {
    await resetDishes()
    show('Menu restored to the original dishes')
    reload()
  }

  return (
    <>
      <header className="admin__head admin__head--row">
        <div>
          <h1>Menu</h1>
          <p className="muted">Add, edit and remove dishes. Changes appear on the customer menu straight away.</p>
        </div>
        <Button onClick={() => setEditing('new')}><Icon name="plus" size={18} /> Add dish</Button>
      </header>

      <div className="search admin__search">
        <label htmlFor="admin-dish-search" className="sr-only">Search dishes</label>
        <Icon name="search" size={20} className="search__icon" />
        <input
          id="admin-dish-search"
          type="search"
          className="input search__input"
          placeholder="Search by name, category or ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p className="results-count" aria-live="polite">
        {!loading && !error ? `${visible.length} of ${dishes?.length ?? 0} dishes` : ''}
      </p>

      {loading && <div className="center-pad"><Spinner label="Loading dishes" /></div>}
      {error && <ErrorState title="We couldn't load the dishes" error={error} onRetry={reload} />}

      {!loading && !error && (dishes?.length ?? 0) === 0 && (
        <EmptyState
          icon="🍽️"
          title="The menu is empty"
          actions={
            <>
              <Button onClick={() => setEditing('new')}>Add a dish</Button>
              <Button variant="secondary" onClick={restoreDefaults}>Restore original menu</Button>
            </>
          }
        >
          Customers see an empty menu until you add dishes.
        </EmptyState>
      )}

      {!loading && !error && dishes?.length > 0 && visible.length === 0 && (
        <EmptyState icon="🔍" title="No dishes match" actions={<Button onClick={() => setQuery('')}>Clear search</Button>}>
          Nothing found for “{query.trim()}”.
        </EmptyState>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="table-wrap card">
          <table className="table">
            <caption className="sr-only">Dishes on the menu</caption>
            <thead>
              <tr>
                <th scope="col">Dish</th>
                <th scope="col">Category</th>
                <th scope="col" className="num">Price</th>
                <th scope="col">Tags</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((dish) => (
                <tr key={dish.id}>
                  <th scope="row" className="table__dish">
                    <span className="table__emoji" aria-hidden="true">{dish.emoji}</span>
                    <span>{dish.name}</span>
                  </th>
                  <td data-label="Category">{dish.category}</td>
                  <td data-label="Price" className="num price">{formatCurrency(dish.price)}</td>
                  <td data-label="Tags">
                    <span className="table__tags">
                      {dish.special && <span className="badge badge--pending">Special</span>}
                      {dish.vegan && <span className="badge badge--delivered">Vegan</span>}
                      {!dish.special && !dish.vegan && <span className="muted">None</span>}
                    </span>
                  </td>
                  <td className="table__actions">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(dish)} aria-label={`Edit ${dish.name}`}>
                      <Icon name="edit" size={16} /> Edit
                    </Button>
                    <Button variant="secondary" size="sm" className="btn--danger-text" onClick={() => setDeleting(dish)} aria-label={`Delete ${dish.name}`}>
                      <Icon name="trash" size={16} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && dishes?.length > 0 && (
        <p className="admin__footnote">
          <button type="button" className="linklike" onClick={restoreDefaults}>Restore the original menu</button>
          <span className="muted"> · replaces all dishes with the starter list from menu-data.json</span>
        </p>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Add a dish' : `Edit ${editing.name}`} onClose={() => setEditing(null)} wide>
          <DishForm dish={editing === 'new' ? null : editing} onSubmit={save} onCancel={() => setEditing(null)} saving={saving} />
        </Modal>
      )}

      {deleting && (
        <Modal title={`Delete ${deleting.name}?`} onClose={() => setDeleting(null)}>
          <p>This removes it from the menu for every customer. Past orders keep their record of it.</p>
          <div className="modal__foot">
            <Button variant="secondary" onClick={() => setDeleting(null)} data-autofocus>Keep dish</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete dish</Button>
          </div>
        </Modal>
      )}
    </>
  )
}
