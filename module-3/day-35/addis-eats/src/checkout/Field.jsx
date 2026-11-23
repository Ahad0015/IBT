import { useId } from 'react'

// One labelled form control with hint and error wiring (feature 10 + 25).
// `as` picks the element: input (default), textarea or select.
export default function Field({ label, name, as = 'input', error, hint, children, required, counter, ...props }) {
  const uid = useId()
  const id = `field-${name}`
  const hintId = hint ? `${uid}-hint` : undefined
  const errorId = error ? `${uid}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const Control = as

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="req" aria-hidden="true"> *</span> : <span className="muted"> (optional)</span>}
      </label>
      <Control
        id={id}
        name={name}
        className="input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        {...props}
      >
        {children}
      </Control>
      {hint && !error && <p id={hintId} className="hint">{hint}</p>}
      {error && (
        <p id={errorId} className="error">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {counter}
    </div>
  )
}
