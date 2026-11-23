import Link from "next/link";
import { db, getSession } from "../../lib/db";
import { cancelOrder } from "../actions";

// Dynamic: each person must see only their own orders (it depends on who is asking).
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">My orders</h1>
        <p className="mt-2">Please sign in to see your orders.</p>
      </main>
    );
  }

  const all = await db.order.findMany();
  const orders = all.filter((o) => o.userId === session.id).reverse();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">My orders</h1>

      {orders.length === 0 && (
        <p className="mt-2">
          No orders yet.{" "}
          <Link href="/menu" className="text-blue-600 underline">
            Browse the menu
          </Link>
        </p>
      )}

      <ul className="mt-3 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded border p-3">
            <p>
              <strong>{o.id}</strong> · {o.status} · {o.total} {o.currency}
            </p>
            <p className="text-sm text-gray-600">
              {o.dishName} × {o.quantity}
              {o.notes ? ` · “${o.notes}”` : ""}
            </p>
            {o.status === "PENDING" && (
              // bind() fixes the first argument, so the action receives the order id.
              // The action re-checks the session and the owner: this button is UX, not security.
              <form action={cancelOrder.bind(null, o.id)} className="mt-2">
                <button className="text-sm text-red-600 underline">Cancel order</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
