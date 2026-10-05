// Pure rules for the checkout form: form object in, errors object out.
// No React, no DOM, no side effects - so it can be tested on its own, and the
// "server" in api/orders.js can reuse the very same rules.

export const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
export const NOTES_MAX = 200;

// Ethiopian mobile numbers come as 0911... or +251911...
export const TELEBIRR = /^(?:\+251|0)9\d{8}$/;

// Never reject a number for formatting we could have fixed ourselves.
export function normalizePhone(value) {
  return String(value ?? "").replace(/[\s-]/g, "");
}

// Field order matters: it decides which invalid field gets the focus.
export const FIELD_ORDER = ["name", "phone", "area", "notes"];

export function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your name";
  }

  if (!TELEBIRR.test(normalizePhone(form.phone))) {
    errors.phone = "Use 09… or +2519… (TeleBirr number)";
  }

  if (!AREAS.includes(form.area)) {
    errors.area = "Choose a delivery area";
  }

  if (form.notes.length > NOTES_MAX) {
    errors.notes = `Notes can be at most ${NOTES_MAX} characters (you have ${form.notes.length})`;
  }

  return errors; // {} means valid
}

// The first invalid field in page order, or undefined when the form is valid.
export function firstInvalidField(errors) {
  return FIELD_ORDER.find((field) => errors[field]);
}
