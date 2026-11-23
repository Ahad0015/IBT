// src/app/kitchen/page.js
import { notFound, redirect } from "next/navigation";
import { orders } from "@/lib/db";
import { getStatus } from "@/lib/orders";
import { getSession } from "@/lib/session";

// src/app/kitchen/page.js
export const metadata = {
  title: "Kitchen",
  description: "Staff view of all incoming orders.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/kitchen");
  if (session.role !== "staff") notFound(); // role checked here, not in the markup

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Kitchen</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul className="flex flex-col gap-3">
        {orders.map((o) => (
          <li key={o.id} className="border p-3 rounded">
            {o.quantity} × dish {o.dishId} for {o.name}:{" "}
            <strong>{getStatus(o)}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
}