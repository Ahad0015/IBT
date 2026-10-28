import Image from "next/image";
import Link from "next/link";

export default function DishCard({ dish }) {
  return (
    <li data-category={dish.category} className="border rounded overflow-hidden bg-white">
      <Link href={`/menu/${dish.id}`}>
        <Image
          src={dish.image}
          alt={dish.name}
          width={dish.width}
          height={dish.height}
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 40vw"
          className="w-full h-40 object-cover"
        />
        <div className="p-3">
          <strong>{dish.name}</strong>
          <p className="text-sm text-stone-500">{dish.category}</p>
        </div>
      </Link>
    </li>
  );
}