// src/app/menu/CategoryBar.js
"use client";

import { useState } from "react";

const categories = ["All", "Starters", "Mains", "Vegetarian"];

export default function CategoryBar() {
  const [active, setActive] = useState("All");

  return (
    <nav className="flex flex-col gap-2">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          className={active === c ? "text-left font-bold underline" : "text-left"}
        >
          {c}
        </button>
      ))}
    </nav>
  );
}