// src/app/orders/CancelButton.js
"use client";

import { useActionState } from "react";
import { cancelOrder } from "@/app/actions";

export default function CancelButton({ orderId }) {
  const [state, formAction, isPending] = useActionState(
    async () => cancelOrder(orderId),
    null
  );

  return (
    <form action={formAction}>
      <button disabled={isPending} className="text-red-700 underline">
        {isPending ? "Cancelling…" : "Cancel order"}
      </button>
      {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}