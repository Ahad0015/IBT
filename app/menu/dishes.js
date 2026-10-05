const dishes = [
  { id: "kitfo", name: "Kitfo", category: "Beef", price: 320 },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 180 },
  { id: "doro-wat", name: "Doro Wat", category: "Chicken", price: 350 },
  { id: "tibs", name: "Tibs", category: "Beef", price: 300 },
];

export const categories = ["All", ...new Set(dishes.map((d) => d.category))];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Flip these two switches to FORCE each special file to show.
const SLOW_MENU = true;    // true  -> loading.js appears
const BROKEN_MENU = false; // true  -> error.js appears

export async function getDishes() {
  if (SLOW_MENU) await wait(2000);
  if (BROKEN_MENU) throw new Error("The kitchen is offline");
  return dishes;
}

export async function getDish(id) {
  // params are always strings; these ids are strings too.
  return dishes.find((d) => d.id === id) ?? null;
}