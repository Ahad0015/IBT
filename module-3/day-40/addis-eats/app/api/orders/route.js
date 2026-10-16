import { getSession } from "../../../lib/db";
import { submitOrder } from "../../../lib/orders";
import { fail } from "../../../lib/http";

// POST /api/orders
// Body: { name, phone, dishId, quantity?, notes? }
// 201 created | 400 not JSON | 401 not signed in | 422 validation | 500 our fault
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return fail("Sign in to place an order", 401);

    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Request body must be valid JSON", 400);
    }

    const result = await submitOrder(body);
    if (result.fieldErrors) {
      return fail("Validation failed", 422, result.fieldErrors);
    }

    return Response.json(result.order, { status: 201 });
  } catch (err) {
    console.error(err); // details stay in the server log
    return fail("Something went wrong", 500); // the caller gets only what they can act on
  }
}
