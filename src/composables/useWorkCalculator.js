import { ref } from 'vue'

export function useWorkCalculator() {
  const grossAmount = ref('')
  const fees = ref('')
  const taxes = ref('')
  const extraIncome = ref('')
  const extraCurrency = ref('USD')
  const extraTax = ref('')

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

  const resetCalculator = () => {
    grossAmount.value = ''
    fees.value = ''
    taxes.value = ''
    extraIncome.value = ''
    extraCurrency.value = 'USD'
    extraTax.value = ''
  }

  return {
    grossAmount,
    fees,
    taxes,
    extraIncome,
    extraCurrency,
    extraTax,
    updateGrossAmount,
    updateFees,
    updateTaxes,
    updateExtraIncome,
    updateExtraCurrency,
    updateExtraTax,
    resetCalculator
  }
} 