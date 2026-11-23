import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish, getDishes, getReviews } from "../dishes";
import AddToCartButton from "../AddToCartButton";

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: d.id }));
}

export default async function DishPage({ params }) {
  const { id } = await params; // Next.js 15+: params is a Promise

  // Parallel, not sequential: ~600ms total instead of 600 + 400.
  const [dish, reviews] = await Promise.all([getDish(id), getReviews(id)]);

  if (!dish) notFound();

  return (
    <main>
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="mt-1 text-gray-600">{dish.category}</p>
      <p className="mt-2 text-lg">{dish.price} ETB</p>

      <div className="mt-3">
        <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price }} />
      </div>

      <h2 className="mt-6 font-semibold">Reviews</h2>
      <ul className="mt-2 space-y-1">
        {reviews.map((r, i) => (
          <li key={i}>
            <strong>{r.author}:</strong> {r.text}
          </li>
        ))}
      </ul>

      <Link href="/menu" className="mt-4 inline-block text-blue-600 underline">
        ← Back to menu
      </Link>
    </main>
  );
}