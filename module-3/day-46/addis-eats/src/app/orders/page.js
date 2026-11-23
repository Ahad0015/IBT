// src/app/orders/page.js
import Link from "next/link";
import { redirect } from "next/navigation";
import { orders } from "@/lib/db";
import { getStatus } from "@/lib/orders";
import { getSession } from "@/lib/session";
import CancelButton from "./CancelButton";

// src/app/orders/page.js
export const metadata = {
  title: "My orders",
  description: "Your Addis Eats orders and where each one is right now.",
  robots: { index: false, follow: false },
};

// Dynamic: reads the session cookie, which only exists at request time.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  // Scoped to the session id: another account's orders can never appear here.
  const mine = orders.filter((o) => o.userId === session.userId);

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">My orders</h1>
      {mine.length === 0 && <p>No orders yet.</p>}

      <ul className="flex flex-col gap-4">
        {mine.map((o) => {
          const status = getStatus(o);
          const finished = ["delivered", "cancelled"].includes(status);

          return (
            <li key={o.id} className="border p-3 rounded">
              <p>
                Dish {o.dishId} × {o.quantity} for {o.name}:{" "}
                <strong>{status}</strong>
              </p>
              <Link href={`/orders/${o.id}`} className="underline">
                Track order
              </Link>
              {!finished && <CancelButton orderId={o.id} />}
            </li>
          );
        })}
      </ul>

      <p className="mt-6">
        <Link href="/checkout" className="underline">Place another order</Link>
      </p>
    </main>
  );
}