// Feature 13: a friendly empty state that always points to a next action.
export default function EmptyState({ icon = '🍽️', title, children, actions }) {
  return (
    <div className="state">
      <div className="state-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {actions && <div className="state__actions">{actions}</div>}
    </div>
  )
}
