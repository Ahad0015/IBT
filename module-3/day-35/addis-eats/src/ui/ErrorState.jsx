import Button from './Button'

// Feature 14: say what went wrong, then offer a way forward.
export default function ErrorState({ title = 'Something went wrong', error, onRetry, children }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state-icon" aria-hidden="true">⚠️</div>
      <h2>{title}</h2>
      <p>{error?.message || 'An unexpected error stopped this page from loading.'}</p>
      <div className="state__actions">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        {children}
      </div>
    </div>
  )
}
