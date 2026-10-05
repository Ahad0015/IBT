"use client";

import { useCart } from "../app/providers";

export default function CartCount() {
  const { items } = useCart();
  const total = items.reduce((sum, i) => sum + i.qty, 0);

  return <span className="ml-1 rounded-full bg-amber-500 px-2 text-sm">{total}</span>;
}