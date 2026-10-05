import { categories } from "./dishes";

export default function CategoryBar() {
  return (
    <ul className="mb-4 flex gap-2">
      {categories.map((c) => (
        <li key={c} className="rounded bg-slate-100 px-3 py-1">
          {c}
        </li>
      ))}
    </ul>
  );
}