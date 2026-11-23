import Link from "next/link";
import { getSession, db } from "../../lib/db";
import CheckoutForm from "./CheckoutForm";

// Forced dynamic: the response depends on who is asking.
// The read that requires it is getSession(). Today it is a mock user from lib/db.js;
// once real sessions arrive it becomes a cookies() read, which also forces dynamic.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Guard (UX only): a signed-out visitor never sees the form.
  // The real protection is inside the placeOrder action, which checks the session again.
  const session = await getSession();

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-2">Please sign in to place an order.</p>
      </main>
    );
  }

  const dishes = (await db.dish.findMany())
    .filter((d) => d.available)
    .map((d) => ({ id: d.id, name: d.name, price: d.price }));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2">
        Signed in as: <strong>{session.name}</strong>
      </p>

      <CheckoutForm dishes={dishes} />

      <Link href="/cart" className="mt-4 inline-block text-blue-600 underline">
        ← Back to cart
      </Link>
    </main>
  );
}
