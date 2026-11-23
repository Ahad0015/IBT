import { db } from "../../../lib/db";

// GET /api/dishes            -> all dishes
// GET /api/dishes?category=Main
export async function GET(request) {
  // Reading request.url makes this handler dynamic.
  const category = new URL(request.url).searchParams.get("category");

  const dishes = await db.dish.findMany();
  const result = category
    ? dishes.filter((d) => d.category.toLowerCase() === category.toLowerCase())
    : dishes;

  return Response.json(result);
}
