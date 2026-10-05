import Link from "next/link";
import { getDishes } from "./dishes";

export default async function DishList() {
  const dishes = await getDishes(); // the slow query

  return (
    <ul className="space-y-3">
      {dishes.map((dish) => (
        <li key={dish.id} className="rounded border p-3">
          <Link href={`/menu/${dish.id}`} className="font-semibold text-blue-600">
            {dish.name}
          </Link>
          <span className="ml-2 text-gray-500">
            {dish.category} · {dish.price} ETB
          </span>
        </li>
      ))}
    </ul>
  );
}