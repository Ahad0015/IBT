import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateCheckout } from './validate.js'

const valid = { name: 'Selam Tadesse', phone: '0911 223 344', area: 'Bole', address: '', note: '' }

test('a complete form has no errors', () => {
  assert.deepEqual(validateCheckout(valid), {})
})

test('each required field reports its own error', () => {
  const errors = validateCheckout({ ...valid, name: '', phone: '123', area: '' })
  assert.deepEqual(Object.keys(errors), ['name', 'phone', 'area'])
})

test('unknown areas and over-long notes are rejected', () => {
  assert.ok(validateCheckout({ ...valid, area: 'Mars' }).area)
  assert.ok(validateCheckout({ ...valid, note: 'x'.repeat(201) }).note)
})
