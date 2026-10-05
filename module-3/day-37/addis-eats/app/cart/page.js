"use client";

import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [items, setItems] = useState([
    { id: "kitfo", name: "Kitfo", qty: 1 },
    { id: "shiro", name: "Shiro", qty: 2 },
  ]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Your cart</h1>
      {items.length === 0 ? (
        <p className="mt-2">Your cart is empty.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              <span>{i.name} × {i.qty}</span>
              <button
                onClick={() => setItems(items.filter((x) => x.id !== i.id))}
                className="text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link href="/checkout" className="mt-4 inline-block text-blue-600 underline">
        Go to checkout
      </Link>
    </main>
  );
}