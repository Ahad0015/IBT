"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions";

const initialState = { ok: false, message: "", fieldErrors: {}, values: {} };

export default function OrderForm({ dishes }) {
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);
  const err = (field) => state.fieldErrors[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-md">
      <input name="name" placeholder="Name" defaultValue={state.values.name} className="border p-2" />
      <p className="text-sm text-red-600">{err("name")}</p>
      <input name="phone" placeholder="Phone" defaultValue={state.values.phone} className="border p-2" />
      <p className="text-sm text-red-600">{err("phone")}</p>
      <input name="address" placeholder="Address" defaultValue={state.values.address} className="border p-2" />
      <p className="text-sm text-red-600">{err("address")}</p>
      <select name="dishId" defaultValue={state.values.dishId ?? ""} className="border p-2">
        <option value="" disabled>Choose a dish</option>
        {dishes.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      <p className="text-sm text-red-600">{err("dishId")}</p>
      <input name="quantity" type="number" defaultValue={state.values.quantity ?? 1} className="border p-2" />
      <p className="text-sm text-red-600">{err("quantity")}</p>
      <button disabled={isPending} className="bg-green-700 text-white p-2 rounded">
        {isPending ? "Placing…" : "Place order"}
      </button>
      <p className={state.ok ? "text-green-700" : "text-red-600"}>{state.message}</p>
    </form>
  );
}