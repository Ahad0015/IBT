import Link from "next/link";
import { getDishes } from "./data";
import DishList from "./DishList";
import FilterShell from "./FilterShell";
import SearchBox from "./SearchBox";

export const metadata = {
  title: "Menu",
  description:
    "Browse the Addis Eats menu: mains, starters and vegetarian dishes with prices. Search by name or category.",
};

export const revalidate = 60;

export default async function Menu() {
  const dishes = await getDishes();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <SearchBox />
      <FilterShell>
        <DishList dishes={dishes} />
      </FilterShell>
      <p className="mt-6">
        <Link href="/" className="underline">Home</Link> |{" "}
        <Link href="/cart" className="underline">Cart</Link>
      </p>
    </main>
  );
}