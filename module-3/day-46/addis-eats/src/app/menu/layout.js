import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <aside>
        <CategoryBar />
      </aside>
      <section style={{ flex: 1 }}>{children}</section>
    </div>
  );
}