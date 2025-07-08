import { describe, it, expect } from 'vitest'
import { calculateFeeOrTax, calculateExtraIncome, calculateExtraTax } from './workCalculatorUtils'

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
  })
}) 