import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";

// ISR: prerendered at build, regenerated at most once an hour.
// Why 3600: dishes change a few times a day, and a menu an hour old
// misleads nobody. Speed matters more than to-the-minute freshness.
export const revalidate = 3600;

export default function MenuPage() {
  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Our menu</h1>
      <Suspense fallback={<DishSkeleton />}>
        <DishList />
      </Suspense>
    </main>
  );
}