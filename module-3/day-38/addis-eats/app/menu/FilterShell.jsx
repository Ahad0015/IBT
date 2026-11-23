"use client";

import { useState } from "react";

export default function FilterShell({ categories, children }) {
  const [selected, setSelected] = useState("All");

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`rounded px-3 py-1 ${
              selected === c ? "bg-slate-900 text-white" : "bg-slate-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Hide dishes outside the chosen category using CSS only. */}
      {selected !== "All" && (
        <style>{`[data-category]:not([data-category="${selected}"]) { display: none; }`}</style>
      )}

      {children}
    </div>
  );
}