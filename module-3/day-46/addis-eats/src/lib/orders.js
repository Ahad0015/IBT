// src/lib/orders.js
export function getStatus(order) {
  if (order.status === "cancelled") return "cancelled";
  const seconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  if (seconds < 15) return "placed";
  if (seconds < 40) return "preparing";
  if (seconds < 70) return "on the way";
  return "delivered";
}

export function toPublic(order) {
  return { ...order, status: getStatus(order) };
}