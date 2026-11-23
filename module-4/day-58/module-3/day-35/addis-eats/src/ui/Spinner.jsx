export default function Spinner({ label = 'Loading', small = false }) {
  return (
    <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span className={`spinner${small ? ' spinner--sm' : ''}`} aria-hidden="true" />
      <span className={small ? 'sr-only' : 'muted'}>{label}…</span>
    </span>
  )
}
