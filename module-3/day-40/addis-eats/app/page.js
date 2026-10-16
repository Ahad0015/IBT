import Link from "next/link";
import { db } from "../lib/db";

// Static: nothing here depends on who is asking, and the specials only need to be
// as fresh as the last build. (To rotate daily, add `export const revalidate = 86400;`
// and the route becomes ISR instead. See STRATEGY.md.)
export default async function HomePage() {
  const dishes = await db.dish.findMany();
  const specials = dishes.filter((d) => d.available).slice(0, 2);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Addis Eats</h1>
      <p className="mt-2">Traditional Ethiopian food, made fresh daily.</p>

      <h2 className="mt-6 text-xl font-semibold">Today&apos;s specials</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {specials.map((d) => (
          <li key={d.id} className="rounded border p-4">
            <Link href={`/menu/${d.id}`} className="font-semibold text-blue-600">
              {d.name}
            </Link>
            <p className="mt-1 text-sm text-gray-600">{d.description}</p>
            <p className="mt-2">
              {d.price} {d.currency}
            </p>
          </li>
        ))}
      </ul>

      <Link href="/menu" className="mt-6 inline-block text-blue-600 underline">
        See the full menu
      </Link>
    </main>
  );
}
