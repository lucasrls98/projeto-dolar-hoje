# 🧪 Test Plan - Dólar Hoje Application

## 📋 Overview

This test plan covers comprehensive testing for the **Dólar Hoje** Vue.js application, a real-time USD/BRL exchange rate calculator with work income calculation features. The application includes three main components: Exchange Rate Display, Currency Converter, and Work Calculator.

## 🎯 Testing Objectives

- Ensure accurate currency conversion calculations
- Validate real-time exchange rate fetching and display
- Test work calculator functionality with multiple currencies and tax scenarios
- Verify responsive design and accessibility
- Test error handling and edge cases
- Validate input sanitization and validation

## 🏗️ Application Architecture

### Components
- **App.vue**: Main application container
- **ExchangeRateCard.vue**: Real-time exchange rate display
- **CurrencyConverter.vue**: USD ↔ BRL converter
- **WorkCalculator.vue**: Income calculation with fees, taxes, and extra income

### Composables
- **useExchangeRate.js**: Exchange rate API integration
- **useCurrencyConverter.js**: Currency conversion logic
- **useWorkCalculator.js**: Work calculator state management

### Utilities
- **workCalculatorUtils.js**: Calculation functions for fees, taxes, and income

## 📊 Test Coverage Areas

### 1. Unit Tests (Vitest)

#### 1.1 Utility Functions (`workCalculatorUtils.js`)

**Test File**: `src/utils/workCalculatorUtils.test.js`

**Coverage Areas**:
- ✅ `calculateFeeOrTax()` function
  - Percent-based fees/taxes in USD and BRL
  - Value-based fees/taxes in USD and BRL
  - Edge cases (missing exchange rate, zero values)
- ✅ `calculateExtraIncome()` function
  - USD to BRL conversion
  - BRL direct input
  - Missing exchange rate handling
- ✅ `calculateExtraTax()` function
  - Percent-based extra tax in USD and BRL
  - Value-based extra tax in USD and BRL
  - Complex percentage calculations
- ✅ `calculateNetAmountBRL()` function
  - Complete net amount calculations
  - Multiple currency scenarios
  - Edge cases and error conditions

**Test Cases**:
```javascript
// Example test scenarios already covered:
- calculateFeeOrTax with 10% fee on $100 USD (should return 50 BRL)
- calculateExtraIncome with $10 USD (should return 50 BRL)
- calculateExtraTax with 13% on 4998 BRL (should return 649.74 BRL)
- calculateNetAmountBRL with complex scenarios
```

#### 1.2 Composables Testing

**Missing Test Files** (Recommended additions):
- `src/composables/useExchangeRate.test.js`
- `src/composables/useCurrencyConverter.test.js`
- `src/composables/useWorkCalculator.test.js`

**Coverage Areas**:
- State management and reactivity
- API integration and error handling
- Input validation and sanitization
- Currency conversion logic

### 2. Integration Tests

#### 2.1 Component Integration

**Test Scenarios**:
- Exchange rate data flow from API to components
- Currency converter integration with exchange rate
- Work calculator integration with all input fields
- Cross-component data synchronization

#### 2.2 API Integration

**Test Scenarios**:
- Exchange rate API success responses
- API error handling and retry functionality
- Network timeout scenarios
- Invalid API response handling

### 3. End-to-End Tests (Cypress)

**Test File**: `cypress/e2e/app.cy.js`

#### 3.1 Exchange Rate Card Tests

**Test Cases**:
- ✅ Loads exchange rate card successfully
- ✅ Displays current USD/BRL rate
- ✅ Shows loading state during API calls
- ✅ Handles API errors gracefully
- ✅ Manual refresh functionality
- ✅ Auto-refresh every 5 minutes
- ✅ Variation percentage display
- ✅ Last update timestamp

**Test Scenarios**:
```javascript
// Already implemented:
it('loads the exchange rate card', () => {
  cy.contains('Cotação em tempo real').should('be.visible')
  cy.get('.exchange-card').should('be.visible')
  cy.get('.exchange-card .rate-value').should('exist')
})
```

#### 3.2 Currency Converter Tests

**Test Cases**:
- ✅ USD to BRL conversion
- ✅ BRL to USD conversion
- ✅ Invert conversion functionality
- ✅ Real-time conversion updates
- ✅ Input validation and error handling
- ✅ Negative input prevention
- ✅ Invalid input handling

**Test Scenarios**:
```javascript
// Already implemented:
it('currency converter converts USD to BRL and handles invalid input', () => {
  cy.get('.converter-card').should('be.visible')
  cy.get('.converter-card input.amount-input').clear().type('10')
  cy.get('.converter-card .converted-amount').should('not.contain', '0,00')
  cy.get('.converter-card input.amount-input').clear().type('-5')
  cy.get('.converter-card .input-error').should('be.visible')
})
```

#### 3.3 Work Calculator Tests

**Test Cases**:
- ✅ Gross amount input and validation
- ✅ Fees calculation (percent and value)
- ✅ Taxes calculation (percent and value)
- ✅ Extra income calculation
- ✅ Extra tax calculation
- ✅ Multi-currency support (USD/BRL)
- ✅ Net amount calculation
- ✅ Total gross and total discount display
- ✅ Input sanitization and clamping
- ✅ Error handling for negative values
- ✅ Percentage validation (0-100%)

**Test Scenarios**:
```javascript
// Already implemented:
it('work calculator calculates net amount and shows error for negative input', () => {
  cy.get('.work-calculator-card').should('be.visible')
  cy.get('input[aria-label="Valor em Dólares (USD)"]').clear().type('1000')
  cy.get('input[aria-label="Taxas e Comissões"]').clear().type('50')
  cy.get('input[aria-label="Impostos e Outras Taxas"]').clear().type('100')
  cy.get('.result-value.net').should('not.contain', 'R$ 0,00')
})

it('calculates extra tax correctly for BRL and USD currencies', () => {
  // Complex scenario testing extra tax calculations
})
```

### 4. User Interface Tests

#### 4.1 Visual Regression Tests

**Test Areas**:
- Exchange rate card appearance
- Currency converter layout
- Work calculator form layout
- Responsive design (mobile, tablet, desktop)
- Loading states and animations
- Error states and messages

#### 4.2 Accessibility Tests

**Test Areas**:
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management
- Form accessibility

**Test Scenarios**:
```javascript
// Recommended additions:
it('supports keyboard navigation', () => {
  cy.get('body').tab()
  cy.focused().should('have.attr', 'aria-label')
})

it('has proper ARIA labels', () => {
  cy.get('input[aria-label]').should('exist')
  cy.get('button[aria-label]').should('exist')
})
```

### 5. Performance Tests

#### 5.1 Load Testing

**Test Scenarios**:
- API response time under normal load
- Multiple concurrent API requests
- Large number input handling
- Memory usage during extended use

#### 5.2 Browser Compatibility

**Test Browsers**:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### 6. Security Tests

#### 6.1 Input Validation

**Test Areas**:
- XSS prevention in input fields
- SQL injection prevention (if applicable)
- Input sanitization
- File upload security (if applicable)

#### 6.2 API Security

**Test Areas**:
- HTTPS enforcement
- API rate limiting
- Error message sanitization
- CORS configuration

## 🚀 Test Execution Strategy

### 1. Test Environment Setup

**Prerequisites**:
- Node.js 16+
- npm dependencies installed
- Development server running on port 3000

**Commands**:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npx vitest run

# Run E2E tests
npx cypress run --e2e

# Run E2E tests in interactive mode
npx cypress open
```

### 2. Test Data Management

**Test Data Requirements**:
- Mock exchange rates for consistent testing
- Sample income amounts for work calculator
- Various fee and tax scenarios
- Edge case values (zero, negative, very large numbers)

**Mock Data Examples**:
```javascript
const mockExchangeRate = 5.0 // 1 USD = 5 BRL
const testScenarios = {
  basic: { gross: 1000, fees: 50, taxes: 100 },
  complex: { gross: 2000, fees: 100, taxes: 200, extraIncome: 500 },
  edgeCases: { gross: 0, fees: 0, taxes: 0 }
}
```

### 3. Continuous Integration

**CI/CD Pipeline**:
- Automated unit test execution
- E2E test execution on multiple browsers
- Performance regression testing
- Security vulnerability scanning

## 📈 Test Metrics and Reporting

### 1. Coverage Metrics

**Target Coverage**:
- Unit Tests: 90%+ code coverage
- Integration Tests: 80%+ component coverage
- E2E Tests: 100% critical user paths

### 2. Quality Gates

**Success Criteria**:
- All unit tests pass
- All E2E tests pass
- No critical accessibility issues
- Performance benchmarks met
- Security vulnerabilities addressed

### 3. Test Reporting

**Reports Generated**:
- Unit test coverage reports
- E2E test execution reports
- Performance test results
- Accessibility audit reports

## 🔧 Test Maintenance

### 1. Test Data Updates

**Regular Updates**:
- Exchange rate test data
- Browser version compatibility
- API endpoint changes
- New feature test cases

### 2. Test Case Review

**Review Schedule**:
- Monthly test case review
- Quarterly test strategy review
- Annual test plan update

### 3. Test Automation

**Automation Priorities**:
- Critical user journeys
- Regression test suites
- Performance benchmarks
- Security scans

## 📝 Test Case Templates

### Unit Test Template
```javascript
describe('Component/Function Name', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange
    const input = 'test data'
    
    // Act
    const result = functionUnderTest(input)
    
    // Assert
    expect(result).toBe(expectedOutput)
  })
})
```

### E2E Test Template
```javascript
it('should [user action] and [expected result]', () => {
  cy.visit('/')
  cy.get('[data-testid="element"]').click()
  cy.get('[data-testid="result"]').should('contain', 'expected text')
})
```

## 🎯 Priority Test Areas

### High Priority
1. **Currency Conversion Accuracy** - Critical for financial calculations
2. **Exchange Rate API Integration** - Core functionality
3. **Work Calculator Calculations** - Main feature
4. **Input Validation** - Security and UX

### Medium Priority
1. **Responsive Design** - User experience
2. **Error Handling** - Robustness
3. **Accessibility** - Compliance
4. **Performance** - User experience

### Low Priority
1. **Visual Regression** - UI consistency
2. **Browser Compatibility** - Edge cases
3. **Load Testing** - Scalability

## 📚 Additional Resources

### Documentation
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [Cypress Documentation](https://docs.cypress.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Accessibility Testing Guide](https://web.dev/accessibility-testing/)

### Tools
- **Unit Testing**: Vitest
- **E2E Testing**: Cypress
- **Coverage**: Vitest coverage
- **Accessibility**: axe-core
- **Performance**: Lighthouse

---

## 📋 Test Checklist

### Pre-Release Testing
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Security scan completed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] API integration tested
- [ ] Error scenarios covered
- [ ] User acceptance testing completed

### Post-Release Monitoring
- [ ] Production error monitoring
- [ ] Performance metrics tracking
- [ ] User feedback collection
- [ ] Bug report analysis
- [ ] Test case updates based on real usage

---

*This test plan should be reviewed and updated regularly to ensure comprehensive coverage of the Dólar Hoje application.*
