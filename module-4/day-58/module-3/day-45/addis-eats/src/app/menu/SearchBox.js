// src/app/menu/SearchBox.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SEARCH_PAGE_SIZE as PAGE_SIZE } from "@/lib/search";

// `initial` is the first page of dishes, fetched on the server. It is shown immediately,
// so the box is never empty on first paint and no request is needed until someone types.
export default function SearchBox({ initial }) {
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

  // Empty term + page 1 = the view the server already rendered: seed it, do not refetch.
  const seeded = debounced === "" && page === 1;
  const key = `/api/dishes?${debounced ? `q=${encodeURIComponent(debounced)}&` : ""}page=${page}&limit=${PAGE_SIZE}`;

  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    fallbackData: seeded ? initial : undefined,
    revalidateIfStale: !seeded, // the seeded view is fresh as of the server render
    keepPreviousData: true, // keep the old results visible while the next ones load
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

      <p className="text-sm text-stone-500 mt-2">
        {debounced ? `Results for "${debounced}"` : "All dishes. Type to search."}
      </p>
      {debounced && isLoading && <p className="mt-2">Searching…</p>}
      {error && <p className="mt-2 text-red-600">Search failed. Try again.</p>}

      {data && (
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