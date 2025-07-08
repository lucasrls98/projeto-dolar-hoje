import { describe, it, expect } from 'vitest'
import { calculateFeeOrTax, calculateExtraIncome, calculateExtraTax, calculateNetAmountBRL } from './workCalculatorUtils'

describe('workCalculatorUtils', () => {
  const exchangeRate = 5 // 1 USD = 5 BRL

  describe('calculateFeeOrTax', () => {
    it('calculates percent fee in BRL', () => {
      expect(calculateFeeOrTax({ amount: '10', type: 'percent', currency: 'USD', base: 100, exchangeRate })).toBe(50)
    })
    it('calculates value fee in USD', () => {
      expect(calculateFeeOrTax({ amount: '10', type: 'value', currency: 'USD', base: 100, exchangeRate })).toBe(50)
    })
    it('calculates value fee in BRL', () => {
      expect(calculateFeeOrTax({ amount: '10', type: 'value', currency: 'BRL', base: 100, exchangeRate })).toBe(10)
    })
    it('returns 0 for missing exchangeRate', () => {
      expect(calculateFeeOrTax({ amount: '10', type: 'percent', currency: 'USD', base: 100, exchangeRate: undefined })).toBe(0)
    })
  })

  describe('calculateExtraIncome', () => {
    it('calculates extra income in USD', () => {
      expect(calculateExtraIncome({ amount: '10', currency: 'USD', exchangeRate })).toBe(50)
    })
    it('calculates extra income in BRL', () => {
      expect(calculateExtraIncome({ amount: '10', currency: 'BRL', exchangeRate })).toBe(10)
    })
    it('returns 0 for missing exchangeRate', () => {
      expect(calculateExtraIncome({ amount: '10', currency: 'USD', exchangeRate: undefined })).toBe(0)
    })
  })

  describe('calculateExtraTax', () => {
    it('calculates percent extra tax in BRL', () => {
      expect(calculateExtraTax({ amount: '10', type: 'percent', currency: 'USD', extraIncome: 100, exchangeRate })).toBe(50)
    })
    it('calculates value extra tax in USD', () => {
      expect(calculateExtraTax({ amount: '10', type: 'value', currency: 'USD', extraIncome: 100, exchangeRate })).toBe(50)
    })
    it('calculates value extra tax in BRL', () => {
      expect(calculateExtraTax({ amount: '10', type: 'value', currency: 'BRL', extraIncome: 100, exchangeRate })).toBe(10)
    })
    it('returns 0 for missing exchangeRate', () => {
      expect(calculateExtraTax({ amount: '10', type: 'percent', currency: 'USD', extraIncome: 100, exchangeRate: undefined })).toBe(0)
    })
    it('calculates percent extra tax correctly for BRL currency', () => {
      // 13% of 4998 BRL = 649.74
      expect(calculateExtraTax({ amount: '13', type: 'percent', currency: 'BRL', extraIncome: 4998, exchangeRate })).toBeCloseTo(649.74, 2)
    })
    it('calculates percent extra tax correctly for USD currency', () => {
      // 13% of 4998 USD = 649.74 * 5 = 3248.7
      expect(calculateExtraTax({ amount: '13', type: 'percent', currency: 'USD', extraIncome: 4998, exchangeRate })).toBeCloseTo(3248.7, 2)
    })
  })
})

// Additional tests for net value calculation in BRL

describe('calculateNetAmountBRL', () => {
  const exchangeRate = 5; // 1 USD = 5 BRL

  it('calculates net amount in BRL with percent fee and no taxes or extras', () => {
    const result = calculateNetAmountBRL({
      grossAmount: '100',
      fees: '10', feesType: 'percent', feesCurrency: 'USD',
      taxes: '0', taxesType: 'percent', taxesCurrency: 'USD',
      extraIncome: '0', extraCurrency: 'USD',
      extraTax: '0', extraTaxType: 'value', extraTaxCurrency: 'USD',
      exchangeRate
    });
    // gross: 100*5=500, fee: 10% of 100*5=50, net: 500-50=450
    expect(result).toBe(450);
  });

  it('calculates net amount in BRL with value fee in BRL and value tax in USD', () => {
    const result = calculateNetAmountBRL({
      grossAmount: '200',
      fees: '20', feesType: 'value', feesCurrency: 'BRL',
      taxes: '10', taxesType: 'value', taxesCurrency: 'USD',
      extraIncome: '0', extraCurrency: 'USD',
      extraTax: '0', extraTaxType: 'value', extraTaxCurrency: 'USD',
      exchangeRate
    });
    // gross: 200*5=1000, fee: 20, tax: 10*5=50, net: 1000-20-50=930
    expect(result).toBe(930);
  });

  it('calculates net amount in BRL with extra income and extra tax', () => {
    const result = calculateNetAmountBRL({
      grossAmount: '50',
      fees: '0', feesType: 'percent', feesCurrency: 'USD',
      taxes: '0', taxesType: 'percent', taxesCurrency: 'USD',
      extraIncome: '10', extraCurrency: 'USD',
      extraTax: '5', extraTaxType: 'percent', extraTaxCurrency: 'USD',
      exchangeRate
    });
    // gross: 50*5=250, extraIncome: 10*5=50, extraTax: 5% of 10*5=2.5, net: 250+50-2.5=297.5
    expect(result).toBe(297.5);
  });

  it('returns 0 if exchangeRate is missing', () => {
    const result = calculateNetAmountBRL({
      grossAmount: '100',
      fees: '10', feesType: 'percent', feesCurrency: 'USD',
      taxes: '0', taxesType: 'percent', taxesCurrency: 'USD',
      extraIncome: '0', extraCurrency: 'USD',
      extraTax: '0', extraTaxType: 'value', extraTaxCurrency: 'USD',
      exchangeRate: undefined
    });
    expect(result).toBe(0);
  });
}); 