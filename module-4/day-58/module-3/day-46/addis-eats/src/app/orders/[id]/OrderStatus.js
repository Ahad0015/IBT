// src/app/orders/[id]/OrderStatus.js
"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const STEPS = ["placed", "preparing", "on the way", "delivered"];
const FINISHED = ["delivered", "cancelled"];

export default function OrderStatus({ id, initialOrder }) {
  const { data: order, error } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initialOrder, // the server-rendered order: no spinner on first paint
    refreshInterval: (latest) =>
      latest && FINISHED.includes(latest.status) ? 0 : 5000, // poll every 5s, stop when finished
  });

  return (
    <div>
      <p className="mb-3">
        {order.quantity} × dish {order.dishId} for {order.name}
      </p>

      {order.status === "cancelled" ? (
        <p className="font-bold text-red-700">This order was cancelled.</p>
      ) : (
        <ol className="flex flex-col gap-1">
          {STEPS.map((s) => (
            <li key={s} className={s === order.status ? "font-bold" : "text-stone-400"}>
              {s === order.status ? "→ " : ""}{s}
            </li>
          ))}
        </ol>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">
          Couldn&apos;t refresh. Showing the last known status.
        </p>
      )}
    </div>
  );
}