import { ref } from 'vue'

export function useWorkCalculator() {
  const grossAmount = ref('')
  const fees = ref('')
  const taxes = ref('')

  const updateGrossAmount = (value) => {
    grossAmount.value = value
  }

  const updateFees = (value) => {
    fees.value = value
  }

  const updateTaxes = (value) => {
    taxes.value = value
  }

  const resetCalculator = () => {
    grossAmount.value = ''
    fees.value = ''
    taxes.value = ''
  }

  return {
    grossAmount,
    fees,
    taxes,
    updateGrossAmount,
    updateFees,
    updateTaxes,
    resetCalculator
  }
} 