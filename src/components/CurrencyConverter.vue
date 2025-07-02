<template>
  <div class="converter-card">
    <h3 class="converter-title">💱 Conversor</h3>
    
    <div class="converter-form">
      <div class="input-group">
        <label class="input-label">{{ isUsdToBrl ? 'Dólares (USD)' : 'Reais (BRL)' }}</label>
        <div class="input-wrapper">
          <span class="currency-prefix">{{ isUsdToBrl ? '$' : 'R$' }}</span>
          <input 
            :value="inputAmount" 
            type="number" 
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:inputAmount', $event.target.value)"
          />
        </div>
      </div>

      <button @click="$emit('invert')" class="invert-button">
        <span>⇅</span>
      </button>

      <div class="input-group">
        <label class="input-label">{{ isUsdToBrl ? 'Reais (BRL)' : 'Dólares (USD)' }}</label>
        <div class="input-wrapper result">
          <span class="currency-prefix">{{ isUsdToBrl ? 'R$' : '$' }}</span>
          <span class="converted-amount">{{ convertedAmount }}</span>
        </div>
      </div>
    </div>

    <div class="converter-info">
      <p class="converter-rate">
        1 {{ isUsdToBrl ? 'USD' : 'BRL' }} = {{ isUsdToBrl ? formattedRate : formattedInverseRate }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'CurrencyConverter',
  props: {
    exchangeRate: {
      type: Number,
      default: null
    },
    inputAmount: {
      type: String,
      default: ''
    },
    isUsdToBrl: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:inputAmount', 'invert'],
  setup(props) {
    const formattedRate = computed(() => {
      if (!props.exchangeRate) return '--'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(props.exchangeRate)
    })

    const formattedInverseRate = computed(() => {
      if (!props.exchangeRate) return '--'
      const inverseRate = 1 / props.exchangeRate
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(inverseRate)
    })

    const convertedAmount = computed(() => {
      if (!props.inputAmount || !props.exchangeRate) return '0,00'
      
      const amount = parseFloat(props.inputAmount)
      if (isNaN(amount)) return '0,00'
      
      let result
      if (props.isUsdToBrl) {
        result = amount * props.exchangeRate
      } else {
        result = amount / props.exchangeRate
      }
      
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(result)
    })

    return {
      formattedRate,
      formattedInverseRate,
      convertedAmount
    }
  }
}
</script>

<style scoped>
.converter-card {
  background: var(--card-background);
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.converter-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.converter-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-align: left;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--background-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.currency-prefix {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
}

.amount-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.input-wrapper.result {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.input-wrapper.result .currency-prefix {
  color: rgba(255, 255, 255, 0.8);
}

.converted-amount {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.invert-button {
  align-self: center;
  background: var(--accent-color);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.invert-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background: var(--secondary-color);
}

.converter-info {
  text-align: center;
}

.converter-rate {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .converter-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .converter-card {
    padding: 1.5rem 1rem;
  }
  
  .converter-form {
    gap: 1rem;
  }
}
</style> 