const dishes = [
  { id: "kitfo", name: "Kitfo", category: "Beef", price: 320 },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 180 },
  { id: "doro-wat", name: "Doro Wat", category: "Chicken", price: 350 },
  { id: "tibs", name: "Tibs", category: "Beef", price: 300 },
  { id: "firfir", name: "Firfir", category: "Vegetarian", price: 160 },
];

export const categories = ["All", ...new Set(dishes.map((d) => d.category))];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Slow only in development, so you can SEE the skeleton
// but your production build is not slowed down.
const SLOW = process.env.NODE_ENV === "development";

export async function getDishes() {
  if (SLOW) await wait(2000);
  return dishes;
}

export async function getDish(id) {
  return dishes.find((d) => d.id === id) ?? null;
}