// src/app/orders/[id]/page.js
import { notFound, redirect } from "next/navigation";
import { orders } from "@/lib/db";
import { toPublic } from "@/lib/orders";
import { getSession } from "@/lib/session";
import OrderStatus from "./OrderStatus";

// src/app/orders/[id]/page.js
export const metadata = {
  title: "Order status",
  description: "Live delivery status of your Addis Eats order.",
  robots: { index: false, follow: false },
};

// Dynamic: reads the session cookie and the order on every request.
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect(`/signin?next=/orders/${id}`);

  const order = orders.find((o) => o.id === id);

  // 404 for both "no such order" and "someone else's order",
  // so the page never confirms that another account's order exists.
  if (!order || order.userId !== session.userId) notFound();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Order status</h1>
      <OrderStatus id={id} initialOrder={toPublic(order)} />
    </main>
  );
}