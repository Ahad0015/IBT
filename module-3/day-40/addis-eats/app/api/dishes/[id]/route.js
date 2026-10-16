import { getDish } from "../../../../lib/db";
import { fail } from "../../../../lib/http";

// GET /api/dishes/dish_1
export async function GET(request, { params }) {
  const { id } = await params; // params is a Promise in current Next.js
  const dish = await getDish(id);

  if (!dish) return fail("No such dish", 404);

  return Response.json(dish);
}
