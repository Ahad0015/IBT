"use server";

import { revalidatePath } from "next/cache";
import { getSession, getOrder, markCancelled, createOrder } from "../lib/db";
import { prepareOrder } from "../lib/orders";

// Server actions are PUBLIC endpoints: anyone can call them with any argument.
// So every check lives INSIDE the action, never only in the component.

// With useActionState the action receives (previousState, formData).
export async function placeOrder(prevState, formData) {
  // Identity comes from the session, never from the form.
  const session = await getSession();
  if (!session) return { error: "Sign in to place an order" };

  const customer = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  };
  // Returned with errors so the form can refill what the person typed.
  const values = {
    name: customer.name,
    phone: customer.phone,
    notes: customer.notes ?? "",
    dishId: String(formData.get("dishId") ?? ""),
    quantity: String(formData.get("quantity") ?? "1"),
  };

  // The cart arrives as [{ id, qty }]. Prices are NOT trusted from the client.
  let lines = [];
  try {
    lines = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    // leave empty; reported below as "Your cart is empty"
  }
  if (!Array.isArray(lines)) lines = [];

  // No cart lines? Fall back to the single dish picked in the form. This is what lets the
  // form work with JavaScript disabled, when there is no client-side cart to read.
  if (lines.length === 0 && values.dishId) {
    lines = [{ id: values.dishId, qty: Number(values.quantity) }];
  }
  if (lines.length === 0) {
    return { fieldErrors: { items: ["Choose a dish, or add something to your cart"] }, values };
  }

  // Validate EVERY line first (same schema as the endpoint). Write nothing yet.
  const prepared = await Promise.all(
    lines.map((l) =>
      prepareOrder({ ...customer, dishId: String(l?.id ?? ""), quantity: Number(l?.qty) })
    )
  );

  const fieldErrors = {};
  for (const p of prepared) {
    if (!p.fieldErrors) continue;
    for (const [field, messages] of Object.entries(p.fieldErrors)) {
      const key = field === "dishId" || field === "quantity" ? "items" : field;
      fieldErrors[key] = [...new Set([...(fieldErrors[key] ?? []), ...messages])];
    }
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };

  // All lines are valid: write one order per dish.
  const orders = [];
  for (const p of prepared) orders.push(await createOrder(p.data));

  revalidatePath("/orders"); // any cached page showing orders is now wrong
  return { ids: orders.map((o) => o.id), total: orders.reduce((s, o) => s + o.total, 0) };
}

export async function cancelOrder(orderId) {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  // orderId came from the client, so treat it as untrusted input.
  const order = await getOrder(String(orderId));
  if (!order) throw new Error("No such order");
  if (order.userId !== session.id) throw new Error("Not yours");
  if (order.status !== "PENDING") throw new Error("Only pending orders can be cancelled");

  await markCancelled(order.id);
  revalidatePath("/orders");
}
