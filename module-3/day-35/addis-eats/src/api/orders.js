import { getDeliveryFee } from '../utils/deliveryEstimate'

// Admin feature 16 (data seeding): build demo orders from menu-data.json so the
// admin dashboard has something to show on first run. The caller decides what to
// do with them (AdminLayout hands them to the order store once).

export async function fetchSampleOrders() {
  const response = await fetch('/menu-data.json')
  if (!response.ok) throw new Error('Sample orders could not be loaded.')
  const { dishes, sampleOrders = [] } = await response.json()
  const byId = new Map(dishes.map((d) => [d.id, d]))
  const now = Date.now()

  return sampleOrders.map((sample, index) => {
    const items = sample.items
      .map(([dishId, qty]) => ({ dish: byId.get(dishId), qty }))
      .filter((line) => line.dish)
      .map(({ dish, qty }) => ({
        id: dish.id,
        name: dish.name,
        emoji: dish.emoji,
        category: dish.category,
        price: dish.price,
        qty,
      }))
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const deliveryFee = getDeliveryFee(sample.area, subtotal)
    const createdAt = new Date(now - sample.daysAgo * 86400000 - index * 1800000).toISOString()
    return {
      id: `AE-${String(1001 + index)}`,
      userPhone: `demo-${sample.phone}`,
      customer: { name: sample.customer, phone: sample.phone, area: sample.area, address: '' },
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      note: '',
      status: sample.status,
      createdAt,
      demo: true,
    }
  })
}
