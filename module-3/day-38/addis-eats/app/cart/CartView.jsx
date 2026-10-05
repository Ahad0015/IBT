"use client";

import Link from "next/link";
import { useCart } from "../providers";

export default function CartView() {
  const { items, dispatch } = useCart();

  if (items.length === 0) {
    return <p className="mt-2">Your cart is empty.</p>;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3">
            <span>{i.name} × {i.qty} · {i.price * i.qty} ETB</span>
            <button
              onClick={() => dispatch({ type: "remove", id: i.id })}
              className="text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-semibold">Total: {total} ETB</p>
      <Link href="/checkout" className="mt-4 inline-block text-blue-600 underline">
        Go to checkout
      </Link>
    </div>
  );
}