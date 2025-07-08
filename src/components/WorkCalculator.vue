<template>
  <div class="work-calculator-card">
    <h3 class="work-calculator-title">💼 Trabalhando na Gringa</h3>
    <p class="work-calculator-description">Calcule quanto você vai receber do seu trabalho da gringa</p>
    
    <div class="work-calculator-form">
      <div class="input-group">
        <label class="input-label required">Valor em Dólares (USD)</label>
        <div class="input-wrapper">
          <span class="currency-prefix">$</span>
          <input 
            :value="grossAmount" 
            type="number" 
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:grossAmount', $event.target.value)"
          />
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">Taxas e Comissões (%)</label>
        <div class="input-wrapper">
          <input 
            :value="fees" 
            type="number" 
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            max="100"
            @input="$emit('update:fees', $event.target.value)"
          />
          <span class="currency-suffix">%</span>
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">Impostos e Outras Taxas (%)</label>
        <div class="input-wrapper">
          <input 
            :value="taxes" 
            type="number" 
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            max="100"
            @input="$emit('update:taxes', $event.target.value)"
          />
          <span class="currency-suffix">%</span>
        </div>
      </div>

      <!-- Extra Income Input -->
      <div class="input-group">
        <label class="input-label">Você gostaria de adicionar alguma renda extra? (opicional)</label>
        <div class="input-wrapper">
          <select class="currency-select" :value="extraCurrency" @change="$emit('update:extraCurrency', $event.target.value)">
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
          </select>
          <input
            :value="extraIncome"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:extraIncome', $event.target.value)"
          />
        </div>
      </div>

      <!-- Extra Tax Input (conditional) -->
      <div class="input-group" v-if="extraIncome && parseFloat(extraIncome) > 0">
        <label class="input-label">Impostos e Outras taxas sobre a Renda Extra</label>
        <div class="input-wrapper">
          <select class="tax-type-select" :value="extraTaxType" @change="$emit('update:extraTaxType', $event.target.value)">
            <option value="value">Valor</option>
            <option value="percent">%</option>
          </select>
          <input
            :value="extraTax"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:extraTax', $event.target.value)"
          />
          <template v-if="extraTaxType === 'percent'">
            <span class="currency-suffix">%</span>
          </template>
          <template v-else>
            <select class="currency-select" :value="extraTaxCurrency" @change="$emit('update:extraTaxCurrency', $event.target.value)">
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </template>
        </div>
      </div>

      <div class="calculation-results">
        <div class="result-item">
          <span class="result-label">Valor Bruto:</span>
          <span class="result-value gross">{{ formattedGrossAmount }}</span>
        </div>
        
        <div class="result-item" v-if="feesAmount > 0">
          <span class="result-label">Taxas ({{ fees }}%):</span>
          <span class="result-value fees">-{{ formattedFeesAmount }}</span>
        </div>
        
        <div class="result-item" v-if="taxesAmount > 0">
          <span class="result-label">Impostos ({{ taxes }}%):</span>
          <span class="result-value taxes">-{{ formattedTaxesAmount }}</span>
        </div>

        <div class="result-item" v-if="extraIncomeBRL > 0">
          <span class="result-label">Renda Extra:</span>
          <span class="result-value extra">+{{ formattedExtraIncome }}</span>
        </div>
        <div class="result-item" v-if="extraTaxBRL > 0">
          <span class="result-label">Taxas sobre Renda Extra:</span>
          <span class="result-value taxes">-{{ formattedExtraTax }}</span>
        </div>
        
        <div class="result-item total">
          <span class="result-label">Valor Líquido:</span>
          <span class="result-value net">{{ formattedNetAmount }}</span>
        </div>
      </div>
    </div>

    <div class="work-calculator-info">
      <p class="work-calculator-rate">
        Taxa de câmbio: 1 USD = {{ formattedExchangeRate }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'WorkCalculator',
  props: {
    exchangeRate: {
      type: Number,
      default: null
    },
    grossAmount: {
      type: String,
      default: ''
    },
    fees: {
      type: String,
      default: ''
    },
    taxes: {
      type: String,
      default: ''
    },
    extraIncome: {
      type: String,
      default: ''
    },
    extraCurrency: {
      type: String,
      default: 'USD'
    },
    extraTax: {
      type: String,
      default: ''
    },
    extraTaxType: {
      type: String,
      default: 'percent'
    },
    extraTaxCurrency: {
      type: String,
      default: 'USD'
    }
  },
  emits: ['update:grossAmount', 'update:fees', 'update:taxes', 'update:extraIncome', 'update:extraCurrency', 'update:extraTax', 'update:extraTaxType', 'update:extraTaxCurrency'],
  setup(props) {
    const formattedExchangeRate = computed(() => {
      if (!props.exchangeRate) return '--'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(props.exchangeRate)
    })

    const grossAmountNumber = computed(() => {
      return parseFloat(props.grossAmount) || 0
    })

    const feesPercentage = computed(() => {
      return parseFloat(props.fees) || 0
    })

    const taxesPercentage = computed(() => {
      return parseFloat(props.taxes) || 0
    })

    const feesAmount = computed(() => {
      return (grossAmountNumber.value * feesPercentage.value) / 100
    })

    const taxesAmount = computed(() => {
      return (grossAmountNumber.value * taxesPercentage.value) / 100
    })

    // Extra income in BRL
    const extraIncomeBRL = computed(() => {
      const extra = parseFloat(props.extraIncome) || 0
      if (!props.exchangeRate) return 0
      if (props.extraCurrency === 'USD') {
        return extra * props.exchangeRate
      } else {
        return extra
      }
    })

    // Extra tax in BRL
    const extraTaxBRL = computed(() => {
      const tax = parseFloat(props.extraTax) || 0
      if (!props.exchangeRate) return 0
      if (props.extraCurrency === 'USD') {
        return tax * props.exchangeRate
      } else {
        return tax
      }
    })

    const netAmount = computed(() => {
      return grossAmountNumber.value - feesAmount.value - taxesAmount.value + extraIncomeBRL.value - extraTaxBRL.value
    })

    const formattedGrossAmount = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      const amountInBRL = grossAmountNumber.value * props.exchangeRate
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInBRL)
    })

    const formattedFeesAmount = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      const amountInBRL = feesAmount.value * props.exchangeRate
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInBRL)
    })

    const formattedTaxesAmount = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      const amountInBRL = taxesAmount.value * props.exchangeRate
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInBRL)
    })

    const formattedExtraIncome = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(extraIncomeBRL.value)
    })

    const formattedExtraTax = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(extraTaxBRL.value)
    })

    const formattedNetAmount = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      const amountInBRL = (netAmount.value * props.exchangeRate) + extraIncomeBRL.value - extraTaxBRL.value
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInBRL)
    })

    return {
      formattedExchangeRate,
      feesAmount,
      taxesAmount,
      netAmount,
      formattedGrossAmount,
      formattedFeesAmount,
      formattedTaxesAmount,
      formattedNetAmount,
      extraIncomeBRL,
      formattedExtraIncome,
      extraTaxBRL,
      formattedExtraTax
    }
  }
}
</script>

<style scoped>
.work-calculator-card {
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

.work-calculator-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.work-calculator-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.4;
}

.work-calculator-form {
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

.input-label.required::after {
  content: ' *';
  color: var(--error-color);
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

.currency-suffix {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 0.5rem;
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

.currency-select {
  margin-right: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.2rem;
  font-size: 0.7rem;
  color: var(--text-primary);
  background: var(--background-color);
  outline: none;
  transition: border 0.2s;
}
.currency-select:focus {
  border-color: var(--primary-color);
}

.tax-type-select {
  margin-right: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--background-color);
  outline: none;
  transition: border 0.2s;
}
.tax-type-select:focus {
  border-color: var(--primary-color);
}

.calculation-results {
  background: var(--background-color);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item.total {
  border-top: 2px solid var(--primary-color);
  border-bottom: none;
  padding-top: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
}

.result-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.result-value {
  font-weight: 600;
  color: var(--text-primary);
}

.result-value.gross {
  color: var(--success-color);
}

.result-value.fees {
  color: var(--warning-color);
}

.result-value.taxes {
  color: var(--error-color);
}

.result-value.net {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.result-value.extra {
  color: var(--accent-color);
}

.work-calculator-info {
  text-align: center;
}

.work-calculator-rate {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .work-calculator-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .work-calculator-card {
    padding: 1.5rem 1rem;
  }
  
  .work-calculator-form {
    gap: 1rem;
  }
  
  .calculation-results {
    padding: 1rem;
  }
}
</style> 