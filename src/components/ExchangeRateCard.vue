<template>
  <div class="exchange-card" :class="{ 'loading': loading, 'error': error }">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando cotação...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erro ao carregar dados</h3>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-button">
        Tentar novamente
      </button>
    </div>

    <div v-else class="exchange-info">
      <div class="currency-display">
        <div class="currency-symbol">$</div>
        <div class="exchange-rate">
          <span class="rate-value">{{ formattedRate }}</span>
          <span class="currency-code">BRL</span>
        </div>
      </div>

      <div class="exchange-details">
        <div class="detail-item">
          <span class="detail-label">Variação:</span>
          <span class="detail-value" :class="variationClass">
            {{ variation }}
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Última atualização:</span>
          <span class="detail-value">{{ lastUpdate }}</span>
        </div>
      </div>

      <button @click="$emit('refresh')" class="refresh-button" :disabled="loading">
        <span v-if="loading" class="spinner-small"></span>
        <span v-else>🔄 Atualizar</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ExchangeRateCard',
  props: {
    exchangeRate: {
      type: Number,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    lastUpdate: {
      type: String,
      default: null
    },
    variation: {
      type: String,
      default: null
    }
  },
  emits: ['refresh', 'retry'],
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

    const variationClass = computed(() => {
      if (!props.variation) return ''
      const value = parseFloat(props.variation.replace(/[^\d.-]/g, ''))
      return value >= 0 ? 'positive' : 'negative'
    })

    return {
      formattedRate,
      variationClass
    }
  }
}
</script>

<style scoped>
.exchange-card {
  background: var(--card-background);
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.3s ease;
}

.exchange-card:hover {
  transform: none;
  box-shadow: var(--shadow-xl);
}

.currency-display {
  margin-bottom: 2rem;
}

.currency-symbol {
  font-size: 4rem;
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 1rem;
}

.exchange-rate {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.rate-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.currency-code {
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.exchange-details {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value.positive {
  color: var(--success-color);
}

.detail-value.negative {
  color: var(--error-color);
}

.refresh-button {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.refresh-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--error-color);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.retry-button {
  background: var(--error-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .exchange-card {
    padding: 2rem 1.5rem;
  }
  
  .currency-symbol {
    font-size: 3rem;
  }
  
  .rate-value {
    font-size: 2.5rem;
  }
  
  .currency-code {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .exchange-card {
    padding: 1.5rem 1rem;
  }
  
  .currency-symbol {
    font-size: 2.5rem;
  }
  
  .rate-value {
    font-size: 2rem;
  }
  
  .currency-code {
    font-size: 1rem;
  }
}
</style> 