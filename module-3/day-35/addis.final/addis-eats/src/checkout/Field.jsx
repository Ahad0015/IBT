// A field that explains itself: real label, the input, an optional hint and
// the error message - wired together so assistive technology can follow it.
//   htmlFor + id        -> the label belongs to the input (and enlarges the tap target)
//   aria-invalid        -> the input is marked as wrong
//   aria-describedby    -> the input points at its hint and error text
//   role="alert"        -> a screen reader announces the error when it appears
// Colour is never the only signal: the message is words, beside a ⚠ mark.
function Field({ name, label, error, hint, as: Control = "input", children, ...props }) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>

      <Control
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Control>

      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="field-error">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default Field;
