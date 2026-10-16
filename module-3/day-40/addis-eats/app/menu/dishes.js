// The menu reads from lib/db.js, the same data the API and the orders use,
// so ids, names and prices can never disagree between pages and endpoints.
import { db, getDish as findDish } from "../../lib/db";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Slow only in development, so you can SEE the skeleton
// but your production build is not slowed down.
const SLOW = process.env.NODE_ENV === "development";

// FAILURE-CHECK HOOKS (Day 40). Inert unless you start the server with
// ENABLE_TEST_ROUTES=1. They let you run the failure checks on a PRODUCTION build:
//   /menu/slow -> loading.js shows for 3 seconds, then not-found
//   /menu/boom -> the page throws, so menu/error.js renders
// Ids that were not prebuilt are rendered on request, which is why this works in production.
const TEST_ROUTES = process.env.ENABLE_TEST_ROUTES === "1";

export async function getDishes() {
  if (SLOW) await wait(2000);
  return db.dish.findMany();
}

export async function getDish(id) {
  if (TEST_ROUTES && id === "slow") await wait(3000);
  if (TEST_ROUTES && id === "boom") throw new Error("Deliberate failure (failure check)");
  return findDish(id);
}

export async function getReviews() {
  if (SLOW) await wait(600);
  return [
    { author: "Selam", text: "Loved it, will order again." },
    { author: "Dawit", text: "Fresh and generous portions." },
  ];
}
