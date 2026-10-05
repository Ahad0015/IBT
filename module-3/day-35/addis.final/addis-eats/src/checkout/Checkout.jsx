import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, selectTotal } from "../cart/cartStore";
import { useAuth } from "../auth/useAuth";
import { placeOrder } from "../api/orders";
import { AREAS, NOTES_MAX, firstInvalidField, validate } from "./validate";
import Field from "./Field";
import "./Checkout.css";

// The six states of this form, and where each one lives:
//   pristine   - touched is empty, so no error is shown yet
//   dirty      - `form` holds their input exactly as typed
//   invalid    - errors, derived from `form` on every render
//   submitting - `submitting` (disabled button + "Sending your order…")
//   failed     - serverErrors / serverError; the values are NEVER cleared
//   succeeded  - clear the cart, then redirect with replace: true
// Only the route guard (<RequireAuth> in App.jsx) sits outside this file.

const ALL_TOUCHED = { name: true, phone: true, area: true, notes: true };

function Checkout() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const clear = useCartStore((s) => s.clear);
  const { user } = useAuth();
  const navigate = useNavigate();

  // One object for the whole form. Every input has a name attribute.
  const [form, setForm] = useState({
    name: "",
    phone: user?.phone ?? "",
    area: AREAS[0],
    notes: "",
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({}); // field rules the server rejected
  const [serverError, setServerError] = useState(null); // the request itself failed
  const inFlight = useRef(false); // survives fast double-clicks even before a re-render

  // Derived, never stored: the errors can never disagree with the values.
  const errors = validate(form);

  // After first blur, then live: an error shows once its field has been visited,
  // and then updates on every keystroke so it vanishes the moment it is fixed.
  const errorFor = (name) => (touched[name] ? errors[name] : undefined) ?? serverErrors[name];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value })); // updater form: always the latest state
    // Their edit answers the server's complaint about that field.
    setServerErrors(({ [name]: _answered, ...rest }) => rest);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function focusField(name) {
    document.getElementById(name)?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault(); // no page reload
    if (inFlight.current || submitting) return; // no double order

    setServerError(null);
    setTouched(ALL_TOUCHED); // an attempt reveals every problem at once

    // Not valid: land the person on the first problem.
    const firstProblem = firstInvalidField(errors);
    if (firstProblem) {
      focusField(firstProblem);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const order = await placeOrder(form, items);
      clear(); // only now - a failure must never cost them their cart
      navigate("/", {
        replace: true, // Back must not return to a finished checkout
        state: { orderPlaced: true, orderId: order.id, orderTotal: order.total },
      });
    } catch (err) {
      // failed: say why, keep every value.
      if (err.status === 422) {
        setServerErrors(err.fieldErrors);
        focusField(firstInvalidField(err.fieldErrors));
      } else {
        setServerError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="panel">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
        <Link to="/menu">Browse the menu</Link>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Checkout</h2>
      <p>Signed in as {user.phone}</p>

      {items.map((item) => (
        <p key={item.id}>
          {item.name} - {item.qty} x {item.price} ETB
        </p>
      ))}
      <h3>Total: {total} ETB</h3>

      {/* onSubmit on the form, not onClick on the button: Enter works, and
          assistive technology announces it correctly. noValidate: our rules speak. */}
      <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
        <h2>Delivery Details</h2>

        <Field
          name="name"
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorFor("name")}
        />

        <Field
          name="phone"
          label="TeleBirr number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="For example 0911 234 567 or +251 911 234 567"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorFor("phone")}
        />

        <Field
          as="select"
          name="area"
          label="Delivery area"
          value={form.area}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorFor("area")}
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Field>

        <Field
          as="textarea"
          name="notes"
          label="Notes (optional)"
          rows={3}
          hint={`${form.notes.length}/${NOTES_MAX} characters`}
          value={form.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errorFor("notes")}
        />

        {/* The button carries the state, and the amount builds trust. It is only
            disabled while sending: disabled-with-no-visible-reason looks broken. */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Sending your order…" : `Order — ${total} ETB`}
        </button>

        {/* A disabled button's label change is not announced, so say it too. */}
        <p role="status" className="sr-only">
          {submitting ? "Sending your order…" : ""}
        </p>

        {serverError && (
          <p role="alert" className="field-error form-error">
            <span aria-hidden="true">⚠</span> {serverError}
          </p>
        )}
      </form>
    </section>
  );
}

export default Checkout;
