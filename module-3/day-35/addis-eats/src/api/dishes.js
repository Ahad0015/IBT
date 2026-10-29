import { local, KEYS } from './storage'

// There is no real backend, so this module stands in for one.
//   * First run:  fetch /menu-data.json and seed localStorage with it (admin feature 16).
//   * After that: read and write localStorage (admin feature 15), so admin edits
//                 show up on the customer menu immediately.
// A short delay keeps loading states honest, and ?simulateError=1 on the URL
// makes every call fail so you can see the error state.

const LATENCY_MS = 450
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function shouldFail() {
  return new URLSearchParams(window.location.search).has('simulateError')
}

async function loadAll() {
  const stored = local.get(KEYS.dishes)
  if (Array.isArray(stored) && stored.length > 0) return stored

  const response = await fetch('/menu-data.json')
  if (!response.ok) throw new Error(`The menu could not be loaded (error ${response.status}).`)
  const data = await response.json()
  local.set(KEYS.dishes, data.dishes)
  return data.dishes
}

function save(dishes) {
  local.set(KEYS.dishes, dishes)
}

export async function getDishes() {
  await wait(LATENCY_MS)
  if (shouldFail()) throw new Error('The kitchen is not answering. Check your connection and try again.')
  return loadAll()
}

export async function getDish(id) {
  const dishes = await getDishes()
  const dish = dishes.find((d) => String(d.id) === String(id))
  if (!dish) {
    const error = new Error('We could not find that dish. It may have been removed from the menu.')
    error.code = 'NOT_FOUND'
    throw error
  }
  return dish
}

export async function createDish(input) {
  const dishes = await loadAll()
  const nextId = dishes.reduce((max, d) => Math.max(max, d.id), 0) + 1
  const dish = { ...input, id: nextId }
  save([...dishes, dish])
  return dish
}

export async function updateDish(id, changes) {
  const dishes = await loadAll()
  const updated = dishes.map((d) => (d.id === id ? { ...d, ...changes, id } : d))
  save(updated)
  return updated.find((d) => d.id === id)
}

export async function deleteDish(id) {
  const dishes = await loadAll()
  save(dishes.filter((d) => d.id !== id))
}

export async function resetDishes() {
  local.remove(KEYS.dishes)
  return loadAll()
}
