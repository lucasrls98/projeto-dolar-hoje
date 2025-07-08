import { ref, watch } from 'vue'

export function useWorkCalculator() {
  const grossAmount = ref('')
  const fees = ref('')
  const taxes = ref('')
  const extraIncome = ref('')
  const extraCurrency = ref('USD')
  const extraTax = ref('')
  const extraTaxType = ref('value') // 'value' or 'percent'
  const extraTaxCurrency = ref('USD')

  // Keep extraTaxCurrency in sync with extraCurrency by default
  watch(extraCurrency, (val) => {
    if (extraTaxType.value === 'value') {
      extraTaxCurrency.value = val
    }
  })

  const updateGrossAmount = (value) => {
    grossAmount.value = value
  }

  const updateFees = (value) => {
    fees.value = value
  }

  const updateTaxes = (value) => {
    taxes.value = value
  }

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
    // When switching to 'value', default to extraCurrency
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
    taxes.value = ''
    extraIncome.value = ''
    extraCurrency.value = 'USD'
    extraTax.value = ''
    extraTaxType.value = 'value'
    extraTaxCurrency.value = 'USD'
  }

  return {
    grossAmount,
    fees,
    taxes,
    extraIncome,
    extraCurrency,
    extraTax,
    extraTaxType,
    extraTaxCurrency,
    updateGrossAmount,
    updateFees,
    updateTaxes,
    updateExtraIncome,
    updateExtraCurrency,
    updateExtraTax,
    updateExtraTaxType,
    updateExtraTaxCurrency,
    resetCalculator
  }
} 