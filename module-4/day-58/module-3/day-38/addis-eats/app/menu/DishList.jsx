import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function DishList({ dishes }) {
  return (
    <ul className="space-y-3">
      {dishes.map((dish) => (
        <li
          key={dish.id}
          data-category={dish.category}
          className="flex items-center justify-between rounded border p-3"
        >
          <div>
            <Link href={`/menu/${dish.id}`} className="font-semibold text-blue-600">
              {dish.name}
            </Link>
            <span className="ml-2 text-gray-500">
              {dish.category} · {dish.price} ETB
            </span>
          </div>
          <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price }} />
        </li>
      ))}
    </ul>
  );
}