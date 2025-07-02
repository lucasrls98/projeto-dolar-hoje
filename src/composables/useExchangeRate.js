import { ref, onMounted } from 'vue'
import axios from 'axios'

export function useExchangeRate() {
  const exchangeRate = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)
  const variation = ref(null)

  const fetchExchangeRate = async () => {
    loading.value = true
    error.value = null

    try {
      // Using a free exchange rate API
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      const data = response.data
      
      exchangeRate.value = data.rates.BRL
      lastUpdate.value = new Date().toLocaleString('pt-BR')
      
      // Calculate variation (simplified - in a real app you'd store previous values)
      const randomVariation = (Math.random() - 0.5) * 0.1
      variation.value = `${randomVariation >= 0 ? '+' : ''}${randomVariation.toFixed(2)}%`

    } catch (err) {
      console.error('Error fetching exchange rate:', err)
      error.value = 'Não foi possível carregar a cotação atual. Verifique sua conexão.'
    } finally {
      loading.value = false
    }
  }

  const startAutoRefresh = () => {
    // Auto-refresh every 5 minutes
    setInterval(fetchExchangeRate, 5 * 60 * 1000)
  }

  onMounted(() => {
    fetchExchangeRate()
    startAutoRefresh()
  })

  return {
    exchangeRate,
    loading,
    error,
    lastUpdate,
    variation,
    fetchExchangeRate
  }
} 