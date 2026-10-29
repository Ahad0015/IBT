// Small, pure validators shared by customer sign-in, checkout and the admin forms.
// Each returns an error message string, or '' when the value is valid.

export function validateName(value) {
  const name = value.trim()
  if (!name) return 'Enter your full name.'
  if (name.length < 2) return 'Your name needs at least 2 letters.'
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(name)) return 'Use letters only. No numbers or symbols.'
  return ''
}

// Accepts 0911223344, 911223344, 251911223344 and +251 911 223 344.
// Ethiopian mobile numbers start with 9 (Ethio telecom) or 7 (Safaricom).
const PHONE_PATTERN = /^(?:\+?251|0)?([79]\d{8})$/

export function normalizePhone(value) {
  const digits = value.replace(/[\s()-]/g, '')
  const match = digits.match(PHONE_PATTERN)
  return match ? `0${match[1]}` : ''
}

export function validatePhone(value) {
  if (!value.trim()) return 'Enter a phone number we can call.'
  if (!normalizePhone(value)) return 'Use an Ethiopian mobile number, like 0911 223 344.'
  return ''
}

export function formatPhone(value) {
  const normalized = normalizePhone(value)
  if (!normalized) return value
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`
}
