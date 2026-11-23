import { useState } from 'react'
import Field from '../checkout/Field'
import '../checkout/checkout.css'
import { CATEGORIES } from '../menu/CategoryBar'
import Button from '../ui/Button'

const BLANK = {
  name: '',
  category: 'Ethiopian',
  price: '',
  emoji: '🍽️',
  image: '',
  prepMinutes: '15',
  spicy: '0',
  description: '',
  ingredients: '',
  vegan: false,
  special: false,
}

function toFormValues(dish) {
  if (!dish) return BLANK
  return {
    ...dish,
    price: String(dish.price),
    prepMinutes: String(dish.prepMinutes),
    spicy: String(dish.spicy),
    ingredients: dish.ingredients.join(', '),
  }
}

function validate(v) {
  const errors = {}
  if (v.name.trim().length < 2) errors.name = 'Enter the dish name.'
  const price = Number(v.price)
  if (v.price === '' || !Number.isFinite(price) || price <= 0) errors.price = 'Enter a price above 0.'
  const prep = Number(v.prepMinutes)
  if (!Number.isInteger(prep) || prep < 1 || prep > 120) errors.prepMinutes = 'Enter whole minutes, from 1 to 120.'
  if (!v.emoji.trim()) errors.emoji = 'Add an emoji so the dish has a picture.'
  if (v.description.trim().length < 10) errors.description = 'Describe the dish in at least 10 characters.'
  if (!v.ingredients.split(',').some((i) => i.trim())) errors.ingredients = 'List at least one ingredient, separated by commas.'
  return errors
}

// Used by DishManager for both Add (admin feature 7) and Edit (feature 8).
export default function DishForm({ dish, onSubmit, onCancel, saving }) {
  const [values, setValues] = useState(() => toFormValues(dish))
  const [errors, setErrors] = useState({})

  function set(event) {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`field-${first}`)?.focus()
      return
    }
    onSubmit({
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      emoji: values.emoji.trim(),
      image: (values.image || '').trim(),
      prepMinutes: Number(values.prepMinutes),
      spicy: Number(values.spicy),
      description: values.description.trim(),
      ingredients: values.ingredients.split(',').map((i) => i.trim()).filter(Boolean),
      vegan: values.vegan,
      special: values.special,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form-grid">
      <div className="form-grid form-grid--2">
        <Field label="Dish name" name="name" required value={values.name} onChange={set} error={errors.name} data-autofocus />
        <Field as="select" label="Category" name="category" required value={values.category} onChange={set}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Field>
        <Field label="Price (ETB)" name="price" type="number" inputMode="decimal" min="1" step="1" required value={values.price} onChange={set} error={errors.price} />
        <Field label="Emoji" name="emoji" required value={values.emoji} onChange={set} error={errors.emoji} maxLength={4} />
        <div className="span-2">
          <Field label="Image path" name="image" value={values.image || ''} onChange={set} hint="Like /images/dishes/doro-wat.jpg. Leave empty to show the emoji." />
        </div>
        <Field label="Prep time (minutes)" name="prepMinutes" type="number" min="1" max="120" required value={values.prepMinutes} onChange={set} error={errors.prepMinutes} />
        <Field as="select" label="Spice level" name="spicy" required value={values.spicy} onChange={set}>
          <option value="0">Not spicy</option>
          <option value="1">Mild</option>
          <option value="2">Medium</option>
          <option value="3">Hot</option>
        </Field>
        <div className="span-2">
          <Field as="textarea" label="Description" name="description" required rows={3} value={values.description} onChange={set} error={errors.description} />
        </div>
        <div className="span-2">
          <Field label="Ingredients" name="ingredients" required value={values.ingredients} onChange={set} error={errors.ingredients} hint="Separate with commas: Chicken, Berbere spice, Onion" />
        </div>
      </div>
      <div className="form-grid form-grid--2">
        <label className="check"><input type="checkbox" name="vegan" checked={values.vegan} onChange={set} /> Vegan</label>
        <label className="check"><input type="checkbox" name="special" checked={values.special} onChange={set} /> Show as today's special</label>
      </div>
      <div className="modal__foot">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : dish ? 'Save changes' : 'Add dish'}</Button>
      </div>
    </form>
  )
}