// Nested layout: wraps /menu AND /menu/[id], and stays mounted when you move between them.
// Server component, no interactivity.
export default function MenuLayout({ children }) {
  return (
    <div className="p-6">
      <p className="mb-4 rounded bg-slate-50 px-3 py-2 text-sm text-gray-700">
        Kitchen hours: daily, 8:00 – 22:00
      </p>
      {children}
    </div>
  );
}
