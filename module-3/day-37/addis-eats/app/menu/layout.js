import CategoryBar from "./CategoryBar";
import Counter from "./Counter";

export default function MenuLayout({ children }) {
  return (
    <div className="flex gap-6 p-6">
      <aside className="w-48 shrink-0">
        <h2 className="mb-2 font-semibold">Categories</h2>
        <CategoryBar />
        <Counter />
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
}