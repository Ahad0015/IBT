import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? "guest";

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2">Signed in as: {session}</p>
      <p className="mt-1">Rendered at: {new Date().toLocaleTimeString()}</p>
      <Link href="/cart" className="mt-4 inline-block text-blue-600 underline">
        ← Back to cart
      </Link>
    </main>
  );
}