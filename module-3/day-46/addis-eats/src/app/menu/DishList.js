import DishCard from "./DishCard";

export default function DishList({ dishes }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {dishes.map((d) => (
        <DishCard key={d.id} dish={d} />
      ))}
    </ul>
  );
}