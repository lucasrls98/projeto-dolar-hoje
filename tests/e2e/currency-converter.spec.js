import { test, expect } from '@playwright/test';

test.describe('Currency Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for exchange rate to load
    await page.waitForSelector('.rate-value', { timeout: 10000 });
  });

  test('should load and display currency converter', async ({ page }) => {
    // Check if the converter card is visible
    await expect(page.locator('.converter-card')).toBeVisible();
    
    // Check if the title is displayed
    await expect(page.locator('.converter-title')).toContainText('💱 Conversor');
  });

  test('should convert USD to BRL correctly', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Clear and type amount
    await inputField.clear();
    await inputField.fill('100');
    
    // Wait for conversion to update
    await page.waitForTimeout(500);
    
    // Check if converted amount is displayed and not zero
    await expect(convertedAmount).toBeVisible();
    const convertedText = await convertedAmount.textContent();
    expect(convertedText).not.toBe('0,00');
    
    // Check if the amount is formatted correctly (Brazilian format)
    expect(convertedText).toMatch(/^\d+\.\d{3},\d{2}$/);
  });

  test('should convert BRL to USD when inverted', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const invertButton = page.locator('.invert-button');
    const convertedAmount = page.locator('.converted-amount');
    
    // First, set an amount in USD
    await inputField.clear();
    await inputField.fill('100');
    await page.waitForTimeout(500);
    
    const usdToBrlAmount = await convertedAmount.textContent();
    
    // Click invert button
    await invertButton.click();
    
    // Check if input is cleared after inversion
    await expect(inputField).toHaveValue('');
    
    // Set the same amount in BRL
    await inputField.fill('100');
    await page.waitForTimeout(500);
    
    // Check if converted amount is different (USD format)
    const brlToUsdAmount = await convertedAmount.textContent();
    expect(brlToUsdAmount).not.toBe(usdToBrlAmount);
    
    // Check if it's formatted as USD (different format)
    expect(brlToUsdAmount).toMatch(/^\d+,\d{2}$/);
  });

  test('should display correct currency prefixes', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const invertButton = page.locator('.invert-button');
    
    // Check USD to BRL mode
    await expect(page.locator('.currency-prefix').first()).toContainText('$');
    await expect(page.locator('.currency-prefix').last()).toContainText('R$');
    
    // Check labels
    await expect(page.locator('.input-label').first()).toContainText('Dólares (USD)');
    await expect(page.locator('.input-label').last()).toContainText('Reais (BRL)');
    
    // Invert to BRL to USD mode
    await invertButton.click();
    
    // Check BRL to USD mode
    await expect(page.locator('.currency-prefix').first()).toContainText('R$');
    await expect(page.locator('.currency-prefix').last()).toContainText('$');
    
    // Check labels after inversion
    await expect(page.locator('.input-label').first()).toContainText('Reais (BRL)');
    await expect(page.locator('.input-label').last()).toContainText('Dólares (USD)');
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Test negative input
    await inputField.clear();
    await inputField.fill('-50');
    
    // Check if error message appears
    await expect(page.locator('.input-error')).toBeVisible();
    await expect(page.locator('.input-error')).toContainText('inválido');
    
    // Check if converted amount shows zero
    await expect(convertedAmount).toContainText('0,00');
  });

  test('should prevent plus and minus key input', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    
    await inputField.click();
    
    // Try to type plus and minus keys
    await inputField.press('+');
    await inputField.press('-');
    
    // Check if the input remains empty
    await expect(inputField).toHaveValue('');
  });

  test('should handle empty input', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Clear input
    await inputField.clear();
    
    // Check if converted amount shows zero
    await expect(convertedAmount).toContainText('0,00');
    
    // Check if no error is shown
    await expect(page.locator('.input-error')).not.toBeVisible();
  });

  test('should display exchange rate information', async ({ page }) => {
    // Check if exchange rate is displayed
    await expect(page.locator('.converter-rate')).toBeVisible();
    
    // Check if rate format is correct
    const rateText = await page.locator('.converter-rate').textContent();
    expect(rateText).toMatch(/1 USD = R\$\s*\d+,\d+/);
  });

  test('should update exchange rate information when inverted', async ({ page }) => {
    const invertButton = page.locator('.invert-button');
    const rateInfo = page.locator('.converter-rate');
    
    // Get initial rate info
    const initialRate = await rateInfo.textContent();
    
    // Invert conversion
    await invertButton.click();
    
    // Check if rate info is updated
    const invertedRate = await rateInfo.textContent();
    expect(invertedRate).not.toBe(initialRate);
    expect(invertedRate).toMatch(/1 BRL = \$\s*\d+,\d+/);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const invertButton = page.locator('.invert-button');
    
    // Check input accessibility
    await expect(inputField).toHaveAttribute('aria-label', 'Valor para conversão');
    await expect(inputField).toHaveAttribute('type', 'number');
    await expect(inputField).toHaveAttribute('min', '0');
    
    // Check button accessibility
    await expect(invertButton).toHaveAttribute('aria-label', 'Inverter conversão');
  });

  test('should handle decimal input correctly', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Test decimal input
    await inputField.clear();
    await inputField.fill('99.99');
    
    await page.waitForTimeout(500);
    
    // Check if conversion works with decimals
    const convertedText = await convertedAmount.textContent();
    expect(convertedText).not.toBe('0,00');
    expect(convertedText).toMatch(/^\d+\.\d{3},\d{2}$/);
  });

  test('should handle large numbers', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Test large number input
    await inputField.clear();
    await inputField.fill('1000000');
    
    await page.waitForTimeout(500);
    
    // Check if large numbers are handled correctly
    const convertedText = await convertedAmount.textContent();
    expect(convertedText).not.toBe('0,00');
    
    // Should be formatted with thousands separator
    expect(convertedText).toMatch(/^\d+\.\d{3},\d{2}$/);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if converter is still visible and properly sized
    await expect(page.locator('.converter-card')).toBeVisible();
    
    // Check if input fields are accessible
    const inputField = page.locator('.converter-card input.amount-input');
    await expect(inputField).toBeVisible();
    
    // Test conversion on mobile
    await inputField.clear();
    await inputField.fill('50');
    await page.waitForTimeout(500);
    
    const convertedAmount = page.locator('.converted-amount');
    await expect(convertedAmount).toBeVisible();
  });

  test('should maintain state during page interactions', async ({ page }) => {
    const inputField = page.locator('.converter-card input.amount-input');
    const convertedAmount = page.locator('.converted-amount');
    
    // Set an amount
    await inputField.clear();
    await inputField.fill('200');
    await page.waitForTimeout(500);
    
    const initialConverted = await convertedAmount.textContent();
    
    // Click somewhere else on the page
    await page.locator('.exchange-card').click();
    
    // Check if the conversion is still displayed
    await expect(convertedAmount).toContainText(initialConverted);
    
    // Check if input still has the value
    await expect(inputField).toHaveValue('200');
  });
});
