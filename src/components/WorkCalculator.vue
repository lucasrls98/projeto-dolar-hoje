<template>
  <div class="work-calculator-card">
    <h3 class="work-calculator-title">💼 Trabalhando na Gringa</h3>
    <p class="work-calculator-description">Calcule quanto você vai receber do seu trabalho da gringa</p>
    
    <div class="work-calculator-form">
      <div class="input-group">
        <label class="input-label required" :for="grossAmountId">Valor em Dólares (USD)</label>
        <div class="input-wrapper">
          <span class="currency-prefix">$</span>
          <input 
            :id="grossAmountId"
            :value="grossAmount" 
            type="number" 
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:grossAmount', $event.target.value)"
            aria-label="Valor em Dólares (USD)"
          />
        </div>
        <span v-if="grossAmountError" class="input-error">{{ grossAmountError }}</span>
      </div>

      <!-- Fees Input -->
      <div class="input-group">
        <label class="input-label" :for="feesId">Taxas e Comissões</label>
        <div class="input-wrapper">
          <select class="tax-type-select" :value="feesType" @change="$emit('update:feesType', $event.target.value)" aria-label="Tipo de taxa">
            <option value="percent">%</option>
            <option value="value">Valor</option>
          </select>
          <input
            :id="feesId"
            :value="fees"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:fees', $event.target.value)"
            aria-label="Taxas e Comissões"
          />
          <template v-if="feesType === 'value'">
            <select class="currency-select" :value="feesCurrency" @change="$emit('update:feesCurrency', $event.target.value)" aria-label="Moeda da taxa">
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </template>
        </div>
        <span v-if="feesError" class="input-error">{{ feesError }}</span>
      </div>

      <!-- Taxes Input -->
      <div class="input-group">
        <label class="input-label" :for="taxesId">Impostos e Outras Taxas</label>
        <div class="input-wrapper">
          <select class="tax-type-select" :value="taxesType" @change="$emit('update:taxesType', $event.target.value)" aria-label="Tipo de imposto">
            <option value="percent">%</option>
            <option value="value">Valor</option>
          </select>
          <input
            :id="taxesId"
            :value="taxes"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:taxes', $event.target.value)"
            aria-label="Impostos e Outras Taxas"
          />
          <template v-if="taxesType === 'value'">
            <select class="currency-select" :value="taxesCurrency" @change="$emit('update:taxesCurrency', $event.target.value)" aria-label="Moeda do imposto">
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </template>
        </div>
        <span v-if="taxesError" class="input-error">{{ taxesError }}</span>
      </div>

      <!-- Extra Income Input -->
      <div class="input-group">
        <label class="input-label" :for="extraIncomeId">Você gostaria de adicionar alguma renda extra? (opicional)</label>
        <div class="input-wrapper">
          <select class="currency-select" :value="extraCurrency" @change="$emit('update:extraCurrency', $event.target.value)" aria-label="Moeda da renda extra">
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
          </select>
          <input
            :id="extraIncomeId"
            :value="extraIncome"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:extraIncome', $event.target.value)"
            aria-label="Renda extra"
          />
        </div>
        <span v-if="extraIncomeError" class="input-error">{{ extraIncomeError }}</span>
      </div>

      <!-- Extra Tax Input (conditional) -->
      <div class="input-group" v-if="extraIncome && parseFloat(extraIncome) > 0">
        <label class="input-label" :for="extraTaxId">Impostos e Outras taxas sobre a Renda Extra</label>
        <div class="input-wrapper">
          <select class="tax-type-select" :value="extraTaxType" @change="$emit('update:extraTaxType', $event.target.value)" aria-label="Tipo de taxa sobre renda extra">
            <option value="value">Valor</option>
            <option value="percent">%</option>
          </select>
          <input
            :id="extraTaxId"
            :value="extraTax"
            type="number"
            class="amount-input"
            placeholder="0.00"
            step="0.01"
            min="0"
            @input="$emit('update:extraTax', $event.target.value)"
            aria-label="Taxa sobre renda extra"
          />
          <template v-if="extraTaxType === 'value'">
            <select class="currency-select" :value="extraTaxCurrency" @change="$emit('update:extraTaxCurrency', $event.target.value)" aria-label="Moeda da taxa sobre renda extra">
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </template>
        </div>
        <span v-if="extraTaxError" class="input-error">{{ extraTaxError }}</span>
      </div>

      <div class="calculation-results">
        <div class="result-item">
          <span class="result-label">Valor Bruto:</span>
          <span class="result-value gross">{{ formattedGrossAmount }}</span>
        </div>
        
        <div class="result-item" v-if="feesAmount > 0">
          <span class="result-label">
            Taxas (
            <template v-if="feesType === 'percent'">{{ fees }}%</template>
            <template v-else>{{ fees }} {{ feesCurrency }}</template>
            ):
          </span>
          <span class="result-value fees">-{{ formattedFeesAmount }}</span>
        </div>
        
        <div class="result-item" v-if="taxesAmount > 0">
          <span class="result-label">
            Impostos (
            <template v-if="taxesType === 'percent'">{{ taxes }}%</template>
            <template v-else>{{ taxes }} {{ taxesCurrency }}</template>
            ):
          </span>
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
import { computed, ref } from 'vue'
import { calculateFeeOrTax, calculateExtraIncome, calculateExtraTax } from '../utils/workCalculatorUtils'

export default {
  name: 'WorkCalculator',
  props: {
    exchangeRate: { type: Number, default: null },
    grossAmount: { type: String, default: '' },
    fees: { type: String, default: '' },
    feesType: { type: String, default: 'percent' },
    feesCurrency: { type: String, default: 'USD' },
    taxes: { type: String, default: '' },
    taxesType: { type: String, default: 'percent' },
    taxesCurrency: { type: String, default: 'USD' },
    extraIncome: { type: String, default: '' },
    extraCurrency: { type: String, default: 'USD' },
    extraTax: { type: String, default: '' },
    extraTaxType: { type: String, default: 'value' },
    extraTaxCurrency: { type: String, default: 'USD' }
  },
  emits: [
    'update:grossAmount',
    'update:fees', 'update:feesType', 'update:feesCurrency',
    'update:taxes', 'update:taxesType', 'update:taxesCurrency',
    'update:extraIncome', 'update:extraCurrency',
    'update:extraTax', 'update:extraTaxType', 'update:extraTaxCurrency'
  ],
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

    const grossAmountNumber = computed(() => parseFloat(props.grossAmount) || 0)

    // Fees in BRL
    const feesAmount = computed(() =>
      calculateFeeOrTax({
        amount: props.fees,
        type: props.feesType,
        currency: props.feesCurrency,
        base: props.grossAmount,
        exchangeRate: props.exchangeRate
      })
    )

    // Taxes in BRL
    const taxesAmount = computed(() =>
      calculateFeeOrTax({
        amount: props.taxes,
        type: props.taxesType,
        currency: props.taxesCurrency,
        base: props.grossAmount,
        exchangeRate: props.exchangeRate
      })
    )

    // Extra income in BRL
    const extraIncomeBRL = computed(() =>
      calculateExtraIncome({
        amount: props.extraIncome,
        currency: props.extraCurrency,
        exchangeRate: props.exchangeRate
      })
    )

    // Extra tax in BRL
    const extraTaxBRL = computed(() =>
      calculateExtraTax({
        amount: props.extraTax,
        type: props.extraTaxType,
        currency: props.extraTaxCurrency,
        extraIncome: props.extraIncome,
        exchangeRate: props.exchangeRate
      })
    )

    const netAmount = computed(() => {
      return grossAmountNumber.value - feesAmount.value - taxesAmount.value
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
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(feesAmount.value)
    })

    const formattedTaxesAmount = computed(() => {
      if (!props.exchangeRate) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(taxesAmount.value)
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
      const amountInBRL = (netAmount.value * props.exchangeRate) + (extraIncomeBRL.value - extraTaxBRL.value)
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInBRL)
    })

    // Accessibility: generate unique IDs for inputs
    const grossAmountId = 'gross-amount-input'
    const feesId = 'fees-input'
    const taxesId = 'taxes-input'
    const extraIncomeId = 'extra-income-input'
    const extraTaxId = 'extra-tax-input'

    // Error states
    const grossAmountError = computed(() => parseFloat(props.grossAmount) < 0 ? 'Valor não pode ser negativo.' : '')
    const feesError = computed(() => parseFloat(props.fees) < 0 ? 'Taxa não pode ser negativa.' : '')
    const taxesError = computed(() => parseFloat(props.taxes) < 0 ? 'Imposto não pode ser negativo.' : '')
    const extraIncomeError = computed(() => parseFloat(props.extraIncome) < 0 ? 'Renda extra não pode ser negativa.' : '')
    const extraTaxError = computed(() => parseFloat(props.extraTax) < 0 ? 'Taxa sobre renda extra não pode ser negativa.' : '')

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
      formattedExtraTax,
      grossAmountId, feesId, taxesId, extraIncomeId, extraTaxId,
      grossAmountError, feesError, taxesError, extraIncomeError, extraTaxError
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
  padding: 0.5rem 0.2rem;
  font-size: 0.7rem;
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

.input-error {
  color: var(--error-color, #e53e3e);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
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