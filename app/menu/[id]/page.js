import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish } from "../dishes";

export default async function DishPage({ params }) {
  // Next.js 15+: params is a Promise, so await it.
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) notFound(); // renders app/not-found.js

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="mt-1 text-gray-600">{dish.category}</p>
      <p className="mt-2 text-lg">{dish.price} ETB</p>
      <Link href="/menu" className="mt-4 inline-block text-blue-600 underline">
        ← Back to menu
      </Link>
    </main>
  );
}