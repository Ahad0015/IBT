// Feature 26: every price in the app goes through this one function.
// Whole birr show without decimals ("ETB 1,250"); fractions show two ("ETB 12.50").
export function formatCurrency(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return 'ETB 0'
  const hasFraction = Math.round(value * 100) % 100 !== 0
  const text = value.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return `ETB ${text}`
}
