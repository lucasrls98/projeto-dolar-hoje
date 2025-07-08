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
  extraIncome, // extra income in USD or BRL (for percent)
  exchangeRate // USD to BRL
}) {
  const value = parseFloat(amount) || 0
  if (!exchangeRate) return 0
  if (type === 'percent') {
    if (currency === 'USD') {
      return (parseFloat(extraIncome) || 0) * value / 100 * exchangeRate;
    } else {
      return (parseFloat(extraIncome) || 0) * value / 100;
    }
  } else {
    if (currency === 'USD') {
      return value * exchangeRate
    } else {
      return value
    }
  }
}

// Calculates the net amount in BRL, including gross, fees, taxes, extra income, and extra tax
export function calculateNetAmountBRL({
  grossAmount, // USD
  fees, feesType, feesCurrency, // fee info
  taxes, taxesType, taxesCurrency, // tax info
  extraIncome, extraCurrency, // extra income info
  extraTax, extraTaxType, extraTaxCurrency, // extra tax info
  exchangeRate // USD to BRL
}) {
  if (!exchangeRate) return 0;
  const grossBRL = (parseFloat(grossAmount) || 0) * exchangeRate;
  const feesBRL = calculateFeeOrTax({ amount: fees, type: feesType, currency: feesCurrency, base: grossAmount, exchangeRate });
  const taxesBRL = calculateFeeOrTax({ amount: taxes, type: taxesType, currency: taxesCurrency, base: grossAmount, exchangeRate });
  const extraIncomeBRL = calculateExtraIncome({ amount: extraIncome, currency: extraCurrency, exchangeRate });
  const extraTaxBRL = calculateExtraTax({ amount: extraTax, type: extraTaxType, currency: extraTaxCurrency, extraIncome, exchangeRate });
  return grossBRL - feesBRL - taxesBRL + extraIncomeBRL - extraTaxBRL;
} 