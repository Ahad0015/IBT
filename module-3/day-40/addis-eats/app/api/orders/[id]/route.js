import { getSession, getOrder } from "../../../../lib/db";
import { fail } from "../../../../lib/http";

// GET /api/orders/ord_900
// 200 yours | 401 not signed in | 403 not yours | 404 no such order
export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) return fail("Sign in to view orders", 401);

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) return fail("No such order", 404);
  if (order.userId !== session.id) return fail("Not your order", 403);

  return Response.json(order);
}
