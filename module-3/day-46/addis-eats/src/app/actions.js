"use server";

// Only async functions may be exported from a "use server" file.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDishes } from "@/app/menu/data";
import { orders } from "@/lib/db";
import { orderSchema, signInSchema } from "@/lib/schema";
import { safeNext } from "@/lib/safe-next";
import { createSession, destroySession, getSession } from "@/lib/session";
import { verifyUser } from "@/lib/users";

const FIELDS = ["name", "phone", "address", "dishId", "quantity"];

export async function signIn(prevState, formData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/")); // never trust a hidden field

  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { message: "Enter your email and password.", email };
  }

  const user = verifyUser(parsed.data.email, parsed.data.password);
  if (!user) {
    // One message for "no such email" and "wrong password".
    return { message: "Invalid email or password.", email };
  }

  await createSession(user.id); // a fresh session id on every sign-in
  redirect(next); // keep outside any try/catch: redirect works by throwing
}

export async function signOut() {
  await destroySession();
  return { ok: true };
}

export async function placeOrder(prevState, formData) {
  const values = Object.fromEntries(
    FIELDS.map((k) => [k, formData.get(k) ?? ""])
  );

  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      message: "Please sign in to place an order.",
      fieldErrors: {},
      values,
    };
  }

  const result = orderSchema.safeParse(values);
  if (!result.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
      values,
    };
  }

  const dishes = await getDishes();
  if (!dishes.some((d) => d.id === result.data.dishId)) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { dishId: ["Unknown dish"] },
      values,
    };
  }

  orders.push({
    id: crypto.randomUUID(),
    userId: session.userId, // always from the session, never from the form
    ...result.data,
    status: "placed",
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/orders");
  return { ok: true, message: "Order placed!", fieldErrors: {}, values: {} };
}

export async function cancelOrder(orderId) {
  const session = await getSession();
  if (!session) {
    return { ok: false, message: "You must be signed in to cancel an order." };
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return { ok: false, message: "Order not found." };
  }

  if (order.userId !== session.userId) {
    return { ok: false, message: "You can only cancel your own orders." };
  }

  order.status = "cancelled";
  revalidatePath("/orders");
  return { ok: true, message: "Order cancelled." };
}