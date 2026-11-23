export default function MenuLayout({ children }) {
  return (
    <div className="flex gap-6 p-6">
      <aside className="w-48 shrink-0 rounded bg-slate-50 p-3 text-sm">
        <h2 className="mb-1 font-semibold">Kitchen hours</h2>
        <p>Daily, 8:00 – 22:00</p>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
}