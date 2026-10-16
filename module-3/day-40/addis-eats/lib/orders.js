import { orderSchema } from "./schema";
import { createOrder, getDish } from "./db";

// Validate one order and price it. Nothing is written yet.
// Returns { data } when valid, or { fieldErrors } when not.
// Shared by the route handler (POST /api/orders) and the server action (placeOrder),
// so the rules live in ONE place.
export async function prepareOrder(input) {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { dishId, quantity } = parsed.data;
  if (!dishId) return { fieldErrors: { dishId: ["Choose a dish"] } };

  const dish = await getDish(dishId);
  if (!dish) return { fieldErrors: { dishId: [`Unknown dish: ${dishId}`] } };
  if (!dish.available) return { fieldErrors: { dishId: [`${dish.name} is not available`] } };

  return {
    data: {
      // parsed.data only holds the schema's keys, so a client cannot inject
      // id, userId, status or total. The server computes the price itself.
      ...parsed.data,
      dishName: dish.name,
      total: dish.price * quantity,
      currency: dish.currency,
    },
  };
}

// Validate, then write.
export async function submitOrder(input) {
  const prepared = await prepareOrder(input);
  if (prepared.fieldErrors) return prepared;
  return { order: await createOrder(prepared.data) };
}
