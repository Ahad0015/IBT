export default function Loading() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">My orders</h1>
      <div className="mt-3 space-y-3">
        {[1, 2].map((n) => (
          <div key={n} className="h-16 animate-pulse rounded bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
