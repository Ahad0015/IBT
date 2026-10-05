import Link from "next/link";

export default function CartPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <p className="mt-2">Your cart is empty for now.</p>
      <Link href="/checkout" className="mt-4 inline-block text-blue-600 underline">
        Go to checkout
      </Link>
    </main>
  );
}