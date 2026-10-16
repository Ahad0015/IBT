"use client";

import { useCart } from "../providers";

export default function AddToCartButton({ dish }) {
  const { dispatch } = useCart();

  return (
    <button
      onClick={() => dispatch({ type: "add", dish })}
      className="rounded bg-green-600 px-3 py-1 text-sm text-white"
    >
      Add to cart
    </button>
  );
}