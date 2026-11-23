// src/app/menu/SearchBox.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const PAGE_SIZE = 2;

export default function SearchBox() {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  // Debounce: only update `debounced` after 300ms without typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(term.trim());
      setPage(1); // a new search starts on page 1
    }, 300);
    return () => clearTimeout(timer); // cancels the previous timer on each keystroke
  }, [term]);

  // Null key when the term is empty: SWR makes no request at all.
  const key = debounced
    ? `/api/dishes?q=${encodeURIComponent(debounced)}&page=${page}&limit=${PAGE_SIZE}`
    : null;

  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    keepPreviousData: true,   // <- Step 5: turn this on
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return (
    <div className="mb-6">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search dishes…"
        className="border p-2 w-full max-w-md"
      />

      {!debounced && (
        <p className="text-sm text-stone-500 mt-2">Type to search the menu.</p>
      )}
      {debounced && isLoading && <p className="mt-2">Searching…</p>}
      {error && <p className="mt-2 text-red-600">Search failed. Try again.</p>}

      {debounced && data && (
        <div className={isValidating ? "opacity-60" : ""}>
          {data.items.length === 0 ? (
            <p className="mt-2">No dishes match &quot;{debounced}&quot;.</p>
          ) : (
            <ul className="mt-2">
              {data.items.map((d) => (
                <li key={d.id}>
                  <Link href={`/menu/${d.id}`} className="underline">{d.name}</Link>{" "}
                  <span className="text-stone-500">({d.category})</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
              ← Prev
            </button>
            <span>Page {data.page} of {data.totalPages}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}