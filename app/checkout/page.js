import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2">Payment details will go here.</p>
      <Link href="/cart" className="mt-4 inline-block text-blue-600 underline">
        ← Back to cart
      </Link>
    </main>
  );
}