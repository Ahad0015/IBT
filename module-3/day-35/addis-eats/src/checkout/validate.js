import { AREA_NAMES } from '../utils/deliveryEstimate.js'
import { validateName, validatePhone } from '../utils/validators.js'

export const NOTE_MAX = 200

// Feature 10. Returns an object of { field: message } containing only the fields
// that are invalid, so `Object.keys(errors).length === 0` means the form is valid.
export function validateCheckout(values) {
  const errors = {}

  const name = validateName(values.name)
  if (name) errors.name = name

  const phone = validatePhone(values.phone)
  if (phone) errors.phone = phone

  if (!values.area) errors.area = 'Choose the area we are delivering to.'
  else if (!AREA_NAMES.includes(values.area)) errors.area = 'Choose one of the areas in the list.'

  if (values.address.trim().length > 120) errors.address = 'Keep the address note under 120 characters.'

  if (values.note.length > NOTE_MAX) errors.note = `Keep your note under ${NOTE_MAX} characters.`

  return errors
}

export function validateField(field, values) {
  return validateCheckout(values)[field] ?? ''
}
