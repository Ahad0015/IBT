import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { getDishes } from "./dishes";

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Our menu</h1>
      <CategoryBar />
      <DishList dishes={dishes} />
    </main>
  );
}