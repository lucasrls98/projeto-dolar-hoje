# Playwright E2E Tests for Dólar Hoje

This directory contains comprehensive End-to-End (E2E) tests for the Dólar Hoje application using Playwright.

## 📁 Test Structure

```
tests/e2e/
├── exchange-rate-card.spec.js    # Exchange Rate Card component tests
├── currency-converter.spec.js    # Currency Converter component tests
├── work-calculator.spec.js       # Work Calculator component tests
├── integration-flows.spec.js     # Complete user workflow tests
├── accessibility.spec.js         # Accessibility compliance tests
├── performance.spec.js           # Performance and load tests
└── utils/
    └── test-utils.js             # Shared test utilities
```

## 🚀 Getting Started

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# Run specific test file
npx playwright test exchange-rate-card.spec.js

# Run tests for specific browser
npx playwright test --project=chromium
```

## 📋 Test Categories

### 1. Component Tests

#### Exchange Rate Card (`exchange-rate-card.spec.js`)
- ✅ Loads and displays exchange rate
- ✅ Shows loading states
- ✅ Handles API errors gracefully
- ✅ Manual refresh functionality
- ✅ Auto-refresh behavior
- ✅ Variation and timestamp display
- ✅ Accessibility attributes
- ✅ Mobile responsiveness

#### Currency Converter (`currency-converter.spec.js`)
- ✅ USD to BRL conversion
- ✅ BRL to USD conversion (invert)
- ✅ Real-time conversion updates
- ✅ Input validation and error handling
- ✅ Currency prefix display
- ✅ Exchange rate information
- ✅ Accessibility compliance
- ✅ Mobile responsiveness

#### Work Calculator (`work-calculator.spec.js`)
- ✅ Basic net amount calculation
- ✅ Fees calculation (percentage and fixed value)
- ✅ Taxes calculation (percentage and fixed value)
- ✅ Extra income handling (USD and BRL)
- ✅ Extra tax calculation
- ✅ Total gross and total discount display
- ✅ Input validation and clamping
- ✅ Complex calculation scenarios
- ✅ Accessibility compliance
- ✅ Mobile responsiveness

### 2. Integration Tests (`integration-flows.spec.js`)
- ✅ Complete user workflow
- ✅ Error recovery workflow
- ✅ Data consistency across components
- ✅ Rapid user interactions
- ✅ Page refresh handling

### 3. Accessibility Tests (`accessibility.spec.js`)
- ✅ Proper heading structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Form labels
- ✅ Color contrast
- ✅ Dynamic content announcements
- ✅ Focus management
- ✅ Semantic HTML
- ✅ Screen reader support
- ✅ Error announcements

### 4. Performance Tests (`performance.spec.js`)
- ✅ Page load time
- ✅ Core Web Vitals
- ✅ Rapid interaction handling
- ✅ Memory leak prevention
- ✅ Large number calculations
- ✅ Mobile performance
- ✅ API delay handling
- ✅ Non-blocking UI
- ✅ Multiple browser tabs
- ✅ Efficient DOM updates

## 🛠️ Test Utilities

The `utils/test-utils.js` file provides helper functions:

- `waitForExchangeRate()` - Wait for exchange rate to load
- `fillConverterInput()` - Fill currency converter input
- `fillWorkCalculatorInputs()` - Fill work calculator inputs
- `simulateApiError()` - Simulate API errors
- `restoreApi()` - Restore API functionality
- `simulateSlowApi()` - Simulate slow API responses
- `parseCurrencyValue()` - Parse currency text to number
- `getExchangeRate()` - Get current exchange rate
- `getConvertedAmount()` - Get converted amount
- `getNetAmount()` - Get net amount

## 📊 Test Configuration

The tests are configured in `playwright.config.js`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, Chrome
- **Retries**: 2 retries on CI, 0 locally
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## 🎯 Test Scenarios Covered

### Critical User Journeys
1. **Check Exchange Rate** → **Convert Currency** → **Calculate Work Income**
2. **Error Recovery** → **Retry** → **Success**
3. **Rapid Interactions** → **All Components Responsive**
4. **Page Refresh** → **Components Still Functional**

### Edge Cases
- Negative input handling
- Percentage validation (0-100%)
- Large number calculations
- Empty input handling
- API error scenarios
- Network timeout handling

### Accessibility Compliance
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes
- Color contrast

### Performance Benchmarks
- Page load < 5 seconds
- LCP < 2.5 seconds
- Rapid interactions < 2 seconds
- Large calculations < 1 second
- Mobile performance maintained

## 🔧 Debugging Tests

### Debug Mode
```bash
npx playwright test --debug
```

### Trace Viewer
```bash
npx playwright show-trace test-results/trace.zip
```

### Screenshots and Videos
- Screenshots: `test-results/`
- Videos: `test-results/`
- Traces: `test-results/`

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Best Practices

1. **Test Isolation**: Each test is independent
2. **Wait Strategies**: Use proper wait conditions
3. **Error Handling**: Test both success and error scenarios
4. **Accessibility**: Include accessibility checks
5. **Performance**: Monitor performance metrics
6. **Mobile Testing**: Test on mobile viewports
7. **Data Validation**: Verify calculation accuracy
8. **User Experience**: Test complete user journeys

## 🐛 Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout values
2. **Elements not found**: Check selectors and wait conditions
3. **API errors**: Verify API endpoints are accessible
4. **Mobile issues**: Check viewport settings
5. **Performance failures**: Review performance thresholds

### Debug Commands
```bash
# Run with verbose output
npx playwright test --reporter=list

# Run specific test with debug
npx playwright test exchange-rate-card.spec.js --debug

# Generate test report
npx playwright show-report
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Performance Testing](https://playwright.dev/docs/test-performance)
- [Mobile Testing](https://playwright.dev/docs/emulation)

---

*These E2E tests ensure the Dólar Hoje application works correctly across all supported browsers and devices, providing confidence in the application's reliability and user experience.*
