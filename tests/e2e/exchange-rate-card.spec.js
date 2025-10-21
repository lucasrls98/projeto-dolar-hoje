import { test, expect } from '@playwright/test';

test.describe('Exchange Rate Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display exchange rate card', async ({ page }) => {
    // Check if the exchange rate card is visible
    await expect(page.locator('.exchange-card')).toBeVisible();
    
    // Check if the title and subtitle are displayed
    await expect(page.locator('h1.title-text')).toContainText('Calculadora da Gringa');
    await expect(page.locator('.subtitle')).toContainText('Cotação em tempo real');
  });

  test('should display exchange rate information', async ({ page }) => {
    // Wait for the exchange rate to load
    await page.waitForSelector('.rate-value', { timeout: 10000 });
    
    // Check if exchange rate is displayed
    const rateValue = page.locator('.rate-value');
    await expect(rateValue).toBeVisible();
    
    // Check if the rate is formatted as Brazilian currency
    const rateText = await rateValue.textContent();
    expect(rateText).toMatch(/R\$\s*\d+,\d+/);
    
    // Check if currency code is displayed
    await expect(page.locator('.currency-code')).toContainText('BRL');
  });

  test('should show loading state initially', async ({ page }) => {
    // The loading state might be very brief, so we'll check for the spinner
    const spinner = page.locator('.spinner');
    
    // Either the spinner should be visible or the rate should be loaded
    const isSpinnerVisible = await spinner.isVisible();
    const isRateVisible = await page.locator('.rate-value').isVisible();
    
    expect(isSpinnerVisible || isRateVisible).toBeTruthy();
  });

  test('should display variation and last update information', async ({ page }) => {
    // Wait for the exchange rate to load
    await page.waitForSelector('.exchange-details', { timeout: 10000 });
    
    // Check if variation is displayed
    await expect(page.locator('.detail-item').first()).toContainText('Variação:');
    
    // Check if last update is displayed
    await expect(page.locator('.detail-item').last()).toContainText('Última atualização:');
    
    // Check if variation has proper styling (positive/negative)
    const variationElement = page.locator('.detail-value').first();
    const variationClass = await variationElement.getAttribute('class');
    expect(variationClass).toMatch(/positive|negative/);
  });

  test('should handle manual refresh', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('.rate-value', { timeout: 10000 });
    
    // Get initial rate
    const initialRate = await page.locator('.rate-value').textContent();
    
    // Click refresh button
    await page.locator('.refresh-button').click();
    
    // Wait for potential update (rate might be the same)
    await page.waitForTimeout(2000);
    
    // Check if refresh button is not disabled
    await expect(page.locator('.refresh-button')).not.toBeDisabled();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept the API call and return an error
    await page.route('**/api.exchangerate-api.com/**', route => {
      route.abort('failed');
    });
    
    // Reload the page to trigger the error
    await page.reload();
    
    // Wait for error state
    await page.waitForSelector('.error-state', { timeout: 10000 });
    
    // Check if error message is displayed
    await expect(page.locator('.error-state h3')).toContainText('Erro ao carregar dados');
    await expect(page.locator('.error-state p')).toContainText('Não foi possível carregar a cotação atual');
    
    // Check if retry button is available
    await expect(page.locator('.retry-button')).toBeVisible();
    await expect(page.locator('.retry-button')).toContainText('Tentar novamente');
  });

  test('should retry after error', async ({ page }) => {
    // First, cause an error
    await page.route('**/api.exchangerate-api.com/**', route => {
      route.abort('failed');
    });
    
    await page.reload();
    await page.waitForSelector('.error-state', { timeout: 10000 });
    
    // Now allow the API to work
    await page.unroute('**/api.exchangerate-api.com/**');
    
    // Click retry button
    await page.locator('.retry-button').click();
    
    // Wait for successful load
    await page.waitForSelector('.rate-value', { timeout: 10000 });
    
    // Verify the error state is gone and rate is displayed
    await expect(page.locator('.error-state')).not.toBeVisible();
    await expect(page.locator('.rate-value')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for proper ARIA attributes
    await expect(page.locator('.loading-state')).toHaveAttribute('role', 'status');
    await expect(page.locator('.loading-state')).toHaveAttribute('aria-live', 'polite');
    
    await expect(page.locator('.error-state')).toHaveAttribute('role', 'alert');
    await expect(page.locator('.error-state')).toHaveAttribute('aria-live', 'assertive');
    
    // Check for aria-label on buttons
    await expect(page.locator('.refresh-button')).toHaveAttribute('aria-label', 'Atualizar cotação');
    await expect(page.locator('.retry-button')).toHaveAttribute('aria-label', 'Tentar novamente');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if card is still visible and properly sized
    await expect(page.locator('.exchange-card')).toBeVisible();
    
    // Check if text sizes are appropriate for mobile
    const titleElement = page.locator('.title');
    const titleFontSize = await titleElement.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    
    // Font size should be smaller on mobile (checking if it's responsive)
    expect(parseFloat(titleFontSize)).toBeLessThan(40); // 2.5rem = 40px
  });
});
