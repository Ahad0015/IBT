"use client";

import { useState } from "react";

export default function FilterShell({ children }) {
  const [vegOnly, setVegOnly] = useState(false);

  return (
    <div className={vegOnly ? "veg-only" : ""}>
      <label>
        <input
          type="checkbox"
          checked={vegOnly}
          onChange={(e) => setVegOnly(e.target.checked)}
        />{" "}
        Vegetarian only
      </label>
      {children}
    </div>
  );
}