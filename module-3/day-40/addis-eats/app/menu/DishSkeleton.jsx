export default function DishSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="h-16 animate-pulse rounded bg-slate-200" />
      ))}
    </div>
  );
}