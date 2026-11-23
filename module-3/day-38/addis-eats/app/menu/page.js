import FilterShell from "./FilterShell";
import DishList from "./DishList";
import { getDishes, categories } from "./dishes";

// Still ISR from Day 37: static, regenerated at most hourly.
export const revalidate = 3600;

export default async function MenuPage() {
  const dishes = await getDishes(); // runs on the server, no hook, no effect

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Our menu</h1>
      <FilterShell categories={categories}>
        <DishList dishes={dishes} />
      </FilterShell>
    </main>
  );
}