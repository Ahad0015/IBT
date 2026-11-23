import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatCurrency } from './formatCurrency.js'
import { getDeliveryFee, getDeliveryEstimate, FREE_DELIVERY_THRESHOLD } from './deliveryEstimate.js'
import { normalizePhone, validateName, validatePhone } from './validators.js'

test('formatCurrency formats Ethiopian birr consistently', () => {
  assert.equal(formatCurrency(320), 'ETB 320')
  assert.equal(formatCurrency(1250), 'ETB 1,250')
  assert.equal(formatCurrency(12.5), 'ETB 12.50')
  assert.equal(formatCurrency('abc'), 'ETB 0')
})

test('delivery fee depends on area and is free above the threshold', () => {
  assert.equal(getDeliveryFee('Bole', 300), 40)
  assert.equal(getDeliveryFee('Kality', 300), 100)
  assert.equal(getDeliveryFee('Kality', FREE_DELIVERY_THRESHOLD), 0)
  assert.equal(getDeliveryFee('', 300), 0)
})

test('delivery estimate needs an area and items', () => {
  assert.equal(getDeliveryEstimate('', [{ qty: 1 }]), null)
  assert.equal(getDeliveryEstimate('Bole', []), null)
  const estimate = getDeliveryEstimate('Bole', [{ qty: 1, prepMinutes: 20 }], (i) => i.prepMinutes)
  assert.equal(estimate.max - estimate.min, 10)
  assert.ok(estimate.min >= 30)
})

test('phone numbers accept common Ethiopian formats', () => {
  for (const ok of ['0911223344', '911223344', '+251911223344', '251 911 223 344', '0711-223-344']) {
    assert.equal(validatePhone(ok), '', ok)
    assert.match(normalizePhone(ok), /^0[79]\d{8}$/)
  }
  for (const bad of ['', '12345', '0811223344', 'abcdefghij', '09112233']) {
    assert.notEqual(validatePhone(bad), '', bad)
  }
})

test('names must be letters', () => {
  assert.equal(validateName('Selam Tadesse'), '')
  assert.equal(validateName("Dawit O'Brien-Bekele"), '')
  assert.notEqual(validateName(''), '')
  assert.notEqual(validateName('A'), '')
  assert.notEqual(validateName('Selam 123'), '')
})
