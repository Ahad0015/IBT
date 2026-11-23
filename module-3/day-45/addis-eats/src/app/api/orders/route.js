
import { dishes } from "@/app/menu/data";
import { orders } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { orderSchema } from "@/lib/schema";
import { getSession } from "@/lib/session";

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return errorResponse(401, "UNAUTHENTICATED", "Sign in first");
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "BAD_JSON", "Request body must be valid JSON");
  }

  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return errorResponse(422, "VALIDATION_FAILED", "Please fix the errors", {
      fieldErrors: result.error.flatten().fieldErrors,
    });
  }

  if (!dishes.some((d) => d.id === result.data.dishId)) {
    return errorResponse(422, "VALIDATION_FAILED", "Please fix the errors", {
      fieldErrors: { dishId: ["Unknown dish"] },
    });
  }

  const order = {
    id: crypto.randomUUID(),
    userId: session.userId,
    ...result.data,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);

  return Response.json(order, { status: 201 });
}
