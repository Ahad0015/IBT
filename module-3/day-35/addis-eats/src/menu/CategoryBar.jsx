export const CATEGORIES = ['Ethiopian', 'Pizza', 'Burgers', 'Drinks']

// Feature 3. The selected category lives in the URL (owned by Menu), so this
// component only displays it and reports clicks.
export default function CategoryBar({ selected, counts, onSelect }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return (
    <div className="category-bar" role="group" aria-label="Filter by category">
      <button type="button" className="chip" aria-pressed={selected === ''} onClick={() => onSelect('')}>
        All <span className="count">{total}</span>
      </button>
      {CATEGORIES.map((name) => (
        <button
          key={name}
          type="button"
          className="chip"
          aria-pressed={selected === name}
          onClick={() => onSelect(name)}
        >
          {name} <span className="count">{counts[name] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}
