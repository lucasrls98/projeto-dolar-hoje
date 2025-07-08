// Returns the BRL value for a fee/tax input
export function calculateFeeOrTax({
  amount, // string or number
  type, // 'percent' or 'value'
  currency, // 'USD' or 'BRL'
  base, // base amount in USD (for percent)
  exchangeRate // USD to BRL
}) {
  const value = parseFloat(amount) || 0
  if (!exchangeRate) return 0
  if (type === 'percent') {
    return (parseFloat(base) || 0) * value / 100 * exchangeRate
  } else {
    if (currency === 'USD') {
      return value * exchangeRate
    } else {
      return value
    }
  }
}

// Returns the BRL value for extra income
export function calculateExtraIncome({
  amount, // string or number
  currency, // 'USD' or 'BRL'
  exchangeRate // USD to BRL
}) {
  const value = parseFloat(amount) || 0
  if (!exchangeRate) return 0
  if (currency === 'USD') {
    return value * exchangeRate
  } else {
    return value
  }
}

// Returns the BRL value for extra tax (percent/value, USD/BRL)
export function calculateExtraTax({
  amount, // string or number
  type, // 'percent' or 'value'
  currency, // 'USD' or 'BRL'
  extraIncome, // extra income in USD (for percent)
  exchangeRate // USD to BRL
}) {
  const value = parseFloat(amount) || 0
  if (!exchangeRate) return 0
  if (type === 'percent') {
    return (parseFloat(extraIncome) || 0) * value / 100 * exchangeRate
  } else {
    if (currency === 'USD') {
      return value * exchangeRate
    } else {
      return value
    }
  }
} 