import { test, expect } from '@playwright/test';

test.describe('Complete User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });
  });

  test('should complete full workflow: check rate, convert currency, calculate work income', async ({ page }) => {
    // Step 1: Verify exchange rate is loaded
    await expect(page.locator('.rate-value')).toBeVisible();
    const exchangeRate = await page.locator('.rate-value').textContent();
    expect(exchangeRate).toMatch(/R\$\s*\d+,\d+/);

    // Step 2: Use currency converter
    await page.locator('.converter-card input.amount-input').fill('100');
    await page.waitForTimeout(500);
    const convertedAmount = await page.locator('.converted-amount').textContent();
    expect(convertedAmount).not.toBe('0,00');

    // Step 3: Use work calculator
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('2000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('100');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('200');
    await page.waitForTimeout(500);

    // Verify all components show calculated values
    await expect(page.locator('.result-value.net')).toBeVisible();
    await expect(page.locator('.result-value.net')).not.toContainText('R$ 0,00');
  });

  test('should handle error recovery workflow', async ({ page }) => {
    // Cause API error
    await page.route('**/api.exchangerate-api.com/**', route => route.abort('failed'));
    await page.reload();
    await page.waitForSelector('.error-state', { timeout: 10000 });

    // Verify error state
    await expect(page.locator('.error-state')).toBeVisible();
    await expect(page.locator('.retry-button')).toBeVisible();

    // Recover from error
    await page.unroute('**/api.exchangerate-api.com/**');
    await page.locator('.retry-button').click();
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    // Verify recovery
    await expect(page.locator('.error-state')).not.toBeVisible();
    await expect(page.locator('.rate-value')).toBeVisible();
  });

  test('should maintain data consistency across components', async ({ page }) => {
    // Get exchange rate from exchange card
    const exchangeRateText = await page.locator('.rate-value').textContent();
    const exchangeRateValue = parseFloat(exchangeRateText.replace(/[^\d,]/g, '').replace(',', '.'));

    // Use converter with known amount
    await page.locator('.converter-card input.amount-input').fill('100');
    await page.waitForTimeout(500);
    const convertedAmount = await page.locator('.converted-amount').textContent();
    const convertedValue = parseFloat(convertedAmount.replace(/[^\d,]/g, '').replace(',', '.'));

    // Use same amount in work calculator
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('100');
    await page.waitForTimeout(500);
    const grossAmount = await page.locator('.result-value.gross').textContent();
    const grossValue = parseFloat(grossAmount.replace(/[^\d,]/g, '').replace(',', '.'));

    // Values should be consistent (allowing for small rounding differences)
    expect(Math.abs(convertedValue - grossValue)).toBeLessThan(1);
  });

  test('should handle rapid user interactions', async ({ page }) => {
    // Rapidly interact with multiple components
    await page.locator('.converter-card input.amount-input').fill('50');
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('50');
    await page.locator('.refresh-button').click();
    await page.locator('.invert-button').click();

    await page.waitForTimeout(1000);

    // All components should still work correctly
    await expect(page.locator('.converted-amount')).toBeVisible();
    await expect(page.locator('.result-value.net')).toBeVisible();
    await expect(page.locator('.rate-value')).toBeVisible();
  });

  test('should work correctly after page refresh', async ({ page }) => {
    // Set up some data
    await page.locator('.converter-card input.amount-input').fill('200');
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1500');

    // Refresh page
    await page.reload();
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    // Verify components are still functional
    await expect(page.locator('.exchange-card')).toBeVisible();
    await expect(page.locator('.converter-card')).toBeVisible();
    await expect(page.locator('.work-calculator-card')).toBeVisible();

    // Test functionality after refresh
    await page.locator('.converter-card input.amount-input').fill('100');
    await page.waitForTimeout(500);
    await expect(page.locator('.converted-amount')).toBeVisible();
  });
});
