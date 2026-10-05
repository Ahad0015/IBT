import { useEffect, useState } from "react";

// A hook of our own: fetches JSON from a url and reports
// the three states the screen needs - loading, error and data.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        setData(await res.json());
      } catch (err) {
        // An abort is us cleaning up, not a real failure.
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }

    load();

    // Cleanup: cancel the request if url changes or the component goes away.
    return () => ctrl.abort();
  }, [url]);

  return { data, loading, error };
}
