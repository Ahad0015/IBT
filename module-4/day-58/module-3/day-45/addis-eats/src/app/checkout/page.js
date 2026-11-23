import Link from "next/link";
import { redirect } from "next/navigation";
import { getDishes } from "../menu/data";
import { getSession } from "@/lib/session";
import OrderForm from "./OrderForm";

export const metadata = {
  title: "Checkout",
  description: "Enter your delivery details and place your Addis Eats order.",
  robots: { index: false, follow: false },
};

// Dynamic: reads the session cookie, which only exists at request time.
export const dynamic = "force-dynamic";

export default async function Checkout() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  const dishes = await getDishes();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-4">Ordering as {session.name}</p>
      <OrderForm dishes={dishes} />
      <p className="mt-6">
        <Link href="/orders" className="underline">My orders</Link> |{" "}
        <Link href="/cart" className="underline">Back to cart</Link>
      </p>
    </main>
  );
}