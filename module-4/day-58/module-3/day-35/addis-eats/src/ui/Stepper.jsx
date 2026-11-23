// Generic +/− control (feature 5). Quantity is owned by whoever renders it.
export default function Stepper({ value, onIncrement, onDecrement, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={onDecrement} aria-label={`Decrease quantity of ${label}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={onIncrement} aria-label={`Increase quantity of ${label}`}>
        +
      </button>
    </div>
  )
}
