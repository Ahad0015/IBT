export default function Loading() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Loading menu…</h1>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-14 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    </main>
  );
}