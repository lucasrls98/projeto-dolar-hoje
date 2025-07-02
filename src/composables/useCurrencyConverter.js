import { ref, computed } from 'vue'

export function useCurrencyConverter(exchangeRate) {
  const inputAmount = ref('')
  const isUsdToBrl = ref(true)

  const invertConversion = () => {
    isUsdToBrl.value = !isUsdToBrl.value
    // Clear input when inverting
    inputAmount.value = ''
  }

  const updateInputAmount = (value) => {
    inputAmount.value = value
  }

  const convertedAmount = computed(() => {
    if (!inputAmount.value || !exchangeRate.value) return '0,00'
    
    const amount = parseFloat(inputAmount.value)
    if (isNaN(amount)) return '0,00'
    
    let result
    if (isUsdToBrl.value) {
      result = amount * exchangeRate.value
    } else {
      result = amount / exchangeRate.value
    }
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(result)
  })

  return {
    inputAmount,
    isUsdToBrl,
    convertedAmount,
    invertConversion,
    updateInputAmount
  }
} 