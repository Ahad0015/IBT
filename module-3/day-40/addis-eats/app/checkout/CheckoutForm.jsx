"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { placeOrder } from "../actions";
import { useCart } from "../providers";

function FieldError({ messages }) {
  if (!messages?.length) return null;
  return (
    <p role="alert" className="text-sm text-red-600">
      {messages[0]}
    </p>
  );
}

export default function CheckoutForm({ dishes }) {
  const { items, dispatch } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, null);

  // Empty the cart once the server confirms the order.
  useEffect(() => {
    if (state?.ids) dispatch({ type: "clear" });
  }, [state, dispatch]);

  if (state?.ids) {
    return (
      <div className="mt-4" role="status">
        <p>
          Order{state.ids.length > 1 ? "s" : ""} <strong>{state.ids.join(", ")}</strong> placed
          · {state.total} ETB.
        </p>
        <Link href="/orders" className="text-blue-600 underline">
          View my orders
        </Link>
      </div>
    );
  }

  const hasCart = items.length > 0;
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const lines = items.map((i) => ({ id: i.id, qty: i.qty })); // ids and quantities only
  const input = "block w-full rounded border px-2 py-1";

  return (
    <form action={formAction} className="mt-4 max-w-sm space-y-3">
      {/* Cart lines, filled in by JavaScript. */}
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      {hasCart ? (
        <ul className="text-sm text-gray-700">
          {items.map((i) => (
            <li key={i.id}>
              {i.name} × {i.qty}
            </li>
          ))}
          <li className="font-semibold">Estimated total: {total} ETB</li>
        </ul>
      ) : (
        // Rendered on the server too, so this form also works with JavaScript disabled.
        <fieldset className="space-y-2">
          <legend className="text-sm text-gray-700">
            Order one dish now, or <Link href="/menu" className="text-blue-600 underline">fill your cart</Link>.
          </legend>
          <select name="dishId" defaultValue={state?.values?.dishId ?? ""} className={input} aria-label="Dish">
            <option value="">Choose a dish</option>
            {dishes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.price} ETB
              </option>
            ))}
          </select>
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue={state?.values?.quantity ?? "1"}
            className={input}
            aria-label="Quantity"
          />
        </fieldset>
      )}
      <FieldError messages={state?.fieldErrors?.items} />

      <div>
        <input name="name" placeholder="Full name" defaultValue={state?.values?.name} className={input} aria-label="Full name" />
        <FieldError messages={state?.fieldErrors?.name} />
      </div>
      <div>
        <input name="phone" placeholder="Phone (09… or +2519…)" defaultValue={state?.values?.phone} className={input} aria-label="Phone" />
        <FieldError messages={state?.fieldErrors?.phone} />
      </div>
      <div>
        <textarea name="notes" placeholder="Notes (optional)" defaultValue={state?.values?.notes} className={input} aria-label="Notes" />
        <FieldError messages={state?.fieldErrors?.notes} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button disabled={pending} className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-60">
        {pending ? "Sending…" : "Place order"}
      </button>
    </form>
  );
}
