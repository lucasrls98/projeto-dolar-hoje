<template>
  <div class="app-container">
    <header class="header">
      <h1 class="title">
        <span class="title-emoji">🪙</span>
        <span class="title-text">Calculadora da Gringa</span>
      </h1>
      <p class="subtitle">💵Cotação em tempo real</p>
    </header>

    <main class="main-content">
      <div class="cards-container">
        <!-- Exchange Rate Card -->
        <ExchangeRateCard
          :exchange-rate="exchangeRate"
          :loading="loading"
          :error="error"
          :last-update="lastUpdate"
          :variation="variation"
          @refresh="fetchExchangeRate"
          @retry="fetchExchangeRate"
        />

        <!-- Currency Converter Card -->
        <CurrencyConverter
          :exchange-rate="exchangeRate"
          :input-amount="inputAmount"
          :is-usd-to-brl="isUsdToBrl"
          @update:input-amount="updateInputAmount"
          @invert="invertConversion"
        />

        <!-- Work Calculator Card -->
        <WorkCalculator
          :exchange-rate="exchangeRate"
          :gross-amount="grossAmount"
          :fees="fees"
          :fees-type="feesType"
          :fees-currency="feesCurrency"
          :taxes="taxes"
          :taxes-type="taxesType"
          :taxes-currency="taxesCurrency"
          :extra-income="extraIncome"
          :extra-currency="extraCurrency"
          :extra-tax="extraTax"
          :extra-tax-type="extraTaxType"
          :extra-tax-currency="extraTaxCurrency"
          @update:gross-amount="updateGrossAmount"
          @update:fees="updateFees"
          @update:fees-type="updateFeesType"
          @update:fees-currency="updateFeesCurrency"
          @update:taxes="updateTaxes"
          @update:taxes-type="updateTaxesType"
          @update:taxes-currency="updateTaxesCurrency"
          @update:extra-income="updateExtraIncome"
          @update:extra-currency="updateExtraCurrency"
          @update:extra-tax="updateExtraTax"
          @update:extra-tax-type="updateExtraTaxType"
          @update:extra-tax-currency="updateExtraTaxCurrency"
        />
      </div>
    </main>

    <footer class="footer">
      <p>Dados fornecidos por APIs públicas de câmbio</p>
    </footer>
  </div>
</template>

<script>
import ExchangeRateCard from './components/ExchangeRateCard.vue'
import CurrencyConverter from './components/CurrencyConverter.vue'
import WorkCalculator from './components/WorkCalculator.vue'
import { useExchangeRate } from './composables/useExchangeRate'
import { useCurrencyConverter } from './composables/useCurrencyConverter'
import { useWorkCalculator } from './composables/useWorkCalculator'

export default {
  name: 'App',
  components: {
    ExchangeRateCard,
    CurrencyConverter,
    WorkCalculator
  },
  setup() {
    const {
      exchangeRate,
      loading,
      error,
      lastUpdate,
      variation,
      fetchExchangeRate
    } = useExchangeRate()

    const {
      inputAmount,
      isUsdToBrl,
      convertedAmount,
      invertConversion,
      updateInputAmount
    } = useCurrencyConverter(exchangeRate)

    const {
      grossAmount,
      fees,
      feesType,
      feesCurrency,
      taxes,
      taxesType,
      taxesCurrency,
      updateGrossAmount,
      updateFees,
      updateFeesType,
      updateFeesCurrency,
      updateTaxes,
      updateTaxesType,
      updateTaxesCurrency,
      extraIncome,
      extraCurrency,
      updateExtraIncome,
      updateExtraCurrency,
      extraTax,
      updateExtraTax,
      extraTaxType,
      updateExtraTaxType,
      extraTaxCurrency,
      updateExtraTaxCurrency
    } = useWorkCalculator()

    return {
      exchangeRate,
      loading,
      error,
      lastUpdate,
      variation,
      inputAmount,
      isUsdToBrl,
      convertedAmount,
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
      fetchExchangeRate,
      invertConversion,
      updateInputAmount,
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
      updateExtraTaxCurrency
    }
  }
}
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-emoji {
  font-size: 2.5rem;
  filter: none;
  background: none;
  -webkit-background-clip: initial;
  -webkit-text-fill-color: initial;
  background-clip: initial;
}

.title-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "exchange converter"
    "work work";
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

/* Target specific components for grid areas */
.cards-container > :nth-child(1) {
  grid-area: exchange;
}

.cards-container > :nth-child(2) {
  grid-area: converter;
}

.cards-container > :nth-child(3) {
  grid-area: work;
  justify-self: center;
  max-width: 500px;
  width: 100%;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 1200px) {
  .cards-container {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
      "exchange converter"
      "work work";
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "exchange"
      "converter"
      "work";
    gap: 1.5rem;
  }
  
  .cards-container > :nth-child(3) {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.75rem;
  }
}
</style> 