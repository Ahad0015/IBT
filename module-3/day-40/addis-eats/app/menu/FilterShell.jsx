"use client";

import { useState } from "react";

// The category SIDEBAR lives here, not in menu/layout.js, on purpose: the selection
// state and the list it filters must share one client boundary. Putting the sidebar in
// the layout would need context or searchParams, and searchParams would make /menu
// dynamic and lose ISR. The server-rendered list arrives as `children` (never imported).
export default function FilterShell({ categories, children }) {
  const [selected, setSelected] = useState("All");

  return (
    <div className="flex gap-6">
      <aside className="w-40 shrink-0">
        <h2 className="mb-2 font-semibold">Categories</h2>
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => setSelected(c)}
                aria-pressed={selected === c}
                className={`w-full rounded px-3 py-1 text-left ${
                  selected === c ? "bg-slate-900 text-white" : "bg-slate-100"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Hide dishes outside the chosen category using CSS only. */}
      {selected !== "All" && (
        <style>{`[data-category]:not([data-category="${selected}"]) { display: none; }`}</style>
      )}

      <div className="flex-1">{children}</div>
    </div>
  );
}
