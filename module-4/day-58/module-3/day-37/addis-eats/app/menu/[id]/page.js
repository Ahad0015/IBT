import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish, getDishes } from "../dishes";

// Build one static HTML file per dish at build time.
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: d.id }));
}

// Uncomment to return 404 for ids that were not listed at build time:
// export const dynamicParams = false;

export default async function DishPage({ params }) {
  const { id } = await params; // Next.js 15+: params is a Promise
  const dish = await getDish(id);

  if (!dish) notFound();

  return (
    <main>
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="mt-1 text-gray-600">{dish.category}</p>
      <p className="mt-2 text-lg">{dish.price} ETB</p>
      <Link href="/menu" className="mt-4 inline-block text-blue-600 underline">
        ← Back to menu
      </Link>
    </main>
  );
}