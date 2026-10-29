// Features 20 + 21: delivery fee and estimated delivery time, derived from the
// chosen area and the cart. Nothing here is stored: callers compute it on render.

export const FREE_DELIVERY_THRESHOLD = 800

// area -> { fee in ETB, travel time in minutes }
export const DELIVERY_AREAS = {
  Bole: { fee: 40, travel: 15 },
  Kazanchis: { fee: 40, travel: 15 },
  Piassa: { fee: 50, travel: 20 },
  'Arat Kilo': { fee: 50, travel: 20 },
  Lideta: { fee: 50, travel: 20 },
  Mexico: { fee: 50, travel: 20 },
  'Sar Bet': { fee: 60, travel: 25 },
  CMC: { fee: 70, travel: 30 },
  Megenagna: { fee: 70, travel: 30 },
  Gerji: { fee: 70, travel: 30 },
  Ayat: { fee: 90, travel: 40 },
  Kality: { fee: 100, travel: 45 },
}

export const AREA_NAMES = Object.keys(DELIVERY_AREAS)

export function getDeliveryFee(area, subtotal) {
  const entry = DELIVERY_AREAS[area]
  if (!entry) return 0
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0
  return entry.fee
}

// Returns { min, max } minutes. Kitchen time is the slowest dish plus a small
// buffer for extra items; travel time depends on the area.
export function getDeliveryEstimate(area, items = [], prepLookup = () => 15) {
  const entry = DELIVERY_AREAS[area]
  if (!entry || items.length === 0) return null
  const slowest = Math.max(...items.map((item) => prepLookup(item)))
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const kitchen = slowest + Math.min(10, Math.floor(itemCount / 3) * 2)
  const min = Math.round((kitchen + entry.travel) / 5) * 5
  return { min, max: min + 10 }
}

export function formatEstimate(estimate) {
  return estimate ? `${estimate.min}–${estimate.max} min` : ''
}

export function estimatedArrival(estimate, from = new Date()) {
  if (!estimate) return ''
  const eta = new Date(from.getTime() + estimate.max * 60000)
  return eta.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
