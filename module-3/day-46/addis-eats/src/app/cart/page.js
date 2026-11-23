// app/cart/page.js
import Link from "next/link";

// src/app/cart/page.js
export const metadata = {
  title: "Your cart",
  description: "Review the dishes in your cart before you check out.",
  robots: { index: false, follow: false },
};

export default function Cart() {
  return (
    <main>
      <h1>Your cart</h1>
      <Link href="/checkout">Go to checkout</Link> |{" "}
      <Link href="/menu">Back to menu</Link>
    </main>
  );
}