import { ref, watch } from 'vue'

export function useWorkCalculator() {
  const grossAmount = ref('')
  // Fees
  const fees = ref('')
  const feesType = ref('percent') // 'percent' or 'value'
  const feesCurrency = ref('USD')
  // Taxes
  const taxes = ref('')
  const taxesType = ref('percent') // 'percent' or 'value'
  const taxesCurrency = ref('USD')
  // Extra income
  const extraIncome = ref('')
  const extraCurrency = ref('USD')
  const extraTax = ref('')
  const extraTaxType = ref('value') // 'value' or 'percent'
  const extraTaxCurrency = ref('USD')

  // Only keep extraTaxCurrency in sync with extraCurrency by default
  watch(extraCurrency, (val) => {
    if (extraTaxType.value === 'value') {
      extraTaxCurrency.value = val
    }
  })

  const updateGrossAmount = (value) => {
    grossAmount.value = value
  }

  // Fees
  const updateFees = (value) => {
    fees.value = value
  }
  const updateFeesType = (value) => {
    feesType.value = value
  }
  const updateFeesCurrency = (value) => {
    feesCurrency.value = value
  }

  // Taxes
  const updateTaxes = (value) => {
    taxes.value = value
  }
  const updateTaxesType = (value) => {
    taxesType.value = value
  }
  const updateTaxesCurrency = (value) => {
    taxesCurrency.value = value
  }

  // Extra income
  const updateExtraIncome = (value) => {
    extraIncome.value = value
  }
  const updateExtraCurrency = (value) => {
    extraCurrency.value = value
  }
  const updateExtraTax = (value) => {
    extraTax.value = value
  }
  const updateExtraTaxType = (value) => {
    extraTaxType.value = value
    if (value === 'value') {
      extraTaxCurrency.value = extraCurrency.value
    }
  }
  const updateExtraTaxCurrency = (value) => {
    extraTaxCurrency.value = value
  }

  const resetCalculator = () => {
    grossAmount.value = ''
    fees.value = ''
    feesType.value = 'percent'
    feesCurrency.value = 'USD'
    taxes.value = ''
    taxesType.value = 'percent'
    taxesCurrency.value = 'USD'
    extraIncome.value = ''
    extraCurrency.value = 'USD'
    extraTax.value = ''
    extraTaxType.value = 'value'
    extraTaxCurrency.value = 'USD'
  }

  return {
    grossAmount,
    fees,
    feesType,
    feesCurrency,
    taxes,
    taxesType,
    taxesCurrency,
    extraIncome,
    extraCurrency,
    extraTax,
    extraTaxType,
    extraTaxCurrency,
    updateGrossAmount,
    updateFees,
    updateFeesType,
    updateFeesCurrency,
    updateTaxes,
    updateTaxesType,
    updateTaxesCurrency,
    updateExtraIncome,
    updateExtraCurrency,
    updateExtraTax,
    updateExtraTaxType,
    updateExtraTaxCurrency,
    resetCalculator
  }
} 