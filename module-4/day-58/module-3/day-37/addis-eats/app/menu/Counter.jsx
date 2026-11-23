"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="mt-4 rounded bg-amber-500 px-3 py-1 text-white"
    >
      Layout counter: {count}
    </button>
  );
}