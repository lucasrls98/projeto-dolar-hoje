import { test, expect } from '@playwright/test';

test.describe('Work Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for exchange rate to load
    await page.waitForSelector('.rate-value', { timeout: 10000 });
  });

  test('should load and display work calculator', async ({ page }) => {
    // Check if the work calculator card is visible
    await expect(page.locator('.work-calculator-card')).toBeVisible();
    
    // Check if the title and description are displayed
    await expect(page.locator('.work-calculator-title')).toContainText('💼 Trabalhando na Gringa');
    await expect(page.locator('.work-calculator-description')).toContainText('Calcule quanto você vai receber do seu trabalho da gringa');
  });

  test('should calculate basic net amount', async ({ page }) => {
    // Fill in basic values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('50');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('100');
    
    // Wait for calculations to update
    await page.waitForTimeout(500);
    
    // Check if net amount is calculated and displayed
    const netAmount = page.locator('.result-value.net');
    await expect(netAmount).toBeVisible();
    await expect(netAmount).not.toContainText('R$ 0,00');
    
    // Check if gross amount is displayed
    const grossAmount = page.locator('.result-value.gross');
    await expect(grossAmount).toBeVisible();
  });

  test('should handle fees as percentage', async ({ page }) => {
    // Set fees type to percentage
    await page.locator('select[aria-label="Tipo de taxa"]').selectOption('percent');
    
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('10'); // 10%
    
    await page.waitForTimeout(500);
    
    // Check if fees are calculated as percentage
    const feesDisplay = page.locator('.result-label').filter({ hasText: 'Taxas' });
    await expect(feesDisplay).toContainText('10%');
    
    // Check if fees amount is displayed
    const feesAmount = page.locator('.result-value.fees');
    await expect(feesAmount).toBeVisible();
  });

  test('should handle fees as fixed value in USD', async ({ page }) => {
    // Set fees type to value
    await page.locator('select[aria-label="Tipo de taxa"]').selectOption('value');
    
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('50');
    
    await page.waitForTimeout(500);
    
    // Check if fees are displayed as value
    const feesDisplay = page.locator('.result-label').filter({ hasText: 'Taxas' });
    await expect(feesDisplay).toContainText('50 USD');
  });

  test('should handle fees as fixed value in BRL', async ({ page }) => {
    // Set fees type to value and currency to BRL
    await page.locator('select[aria-label="Tipo de taxa"]').selectOption('value');
    await page.locator('select[aria-label="Moeda da taxa"]').selectOption('BRL');
    
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('100');
    
    await page.waitForTimeout(500);
    
    // Check if fees are displayed as BRL value
    const feesDisplay = page.locator('.result-label').filter({ hasText: 'Taxas' });
    await expect(feesDisplay).toContainText('100 BRL');
  });

  test('should handle taxes as percentage', async ({ page }) => {
    // Set taxes type to percentage
    await page.locator('select[aria-label="Tipo de imposto"]').selectOption('percent');
    
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('15'); // 15%
    
    await page.waitForTimeout(500);
    
    // Check if taxes are calculated as percentage
    const taxesDisplay = page.locator('.result-label').filter({ hasText: 'Impostos' });
    await expect(taxesDisplay).toContainText('15%');
    
    // Check if taxes amount is displayed
    const taxesAmount = page.locator('.result-value.taxes');
    await expect(taxesAmount).toBeVisible();
  });

  test('should handle extra income in USD', async ({ page }) => {
    // Fill in basic values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    
    // Add extra income
    await page.locator('input[aria-label="Renda extra"]').fill('200');
    
    await page.waitForTimeout(500);
    
    // Check if extra income is displayed
    const extraIncomeDisplay = page.locator('.result-label').filter({ hasText: 'Renda Extra' });
    await expect(extraIncomeDisplay).toBeVisible();
    
    const extraIncomeAmount = page.locator('.result-value.extra');
    await expect(extraIncomeAmount).toBeVisible();
  });

  test('should handle extra income in BRL', async ({ page }) => {
    // Set extra income currency to BRL
    await page.locator('select[aria-label="Moeda da renda extra"]').selectOption('BRL');
    
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Renda extra"]').fill('500');
    
    await page.waitForTimeout(500);
    
    // Check if extra income is displayed
    const extraIncomeAmount = page.locator('.result-value.extra');
    await expect(extraIncomeAmount).toBeVisible();
  });

  test('should handle extra tax as percentage', async ({ page }) => {
    // Fill in values to show extra tax section
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Renda extra"]').fill('200');
    
    // Set extra tax type to percentage
    await page.locator('select[aria-label="Tipo de taxa sobre renda extra"]').selectOption('percent');
    await page.locator('input[aria-label="Taxa sobre renda extra"]').fill('13'); // 13%
    
    await page.waitForTimeout(500);
    
    // Check if extra tax is displayed
    const extraTaxDisplay = page.locator('.result-label').filter({ hasText: 'Taxas sobre Renda Extra' });
    await expect(extraTaxDisplay).toBeVisible();
    
    const extraTaxAmount = page.locator('.result-value.taxes').last();
    await expect(extraTaxAmount).toBeVisible();
  });

  test('should handle extra tax as fixed value', async ({ page }) => {
    // Fill in values to show extra tax section
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Renda extra"]').fill('200');
    
    // Set extra tax type to value
    await page.locator('select[aria-label="Tipo de taxa sobre renda extra"]').selectOption('value');
    await page.locator('input[aria-label="Taxa sobre renda extra"]').fill('25');
    
    await page.waitForTimeout(500);
    
    // Check if extra tax is displayed
    const extraTaxDisplay = page.locator('.result-label').filter({ hasText: 'Taxas sobre Renda Extra' });
    await expect(extraTaxDisplay).toBeVisible();
  });

  test('should display total gross and total discount', async ({ page }) => {
    // Fill in comprehensive values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('50');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('100');
    await page.locator('input[aria-label="Renda extra"]').fill('200');
    
    await page.waitForTimeout(500);
    
    // Check if total gross is displayed
    const totalGrossDisplay = page.locator('.result-label').filter({ hasText: 'Valor Total Bruto' });
    await expect(totalGrossDisplay).toBeVisible();
    
    const totalGrossAmount = page.locator('.result-value.gross-total');
    await expect(totalGrossAmount).toBeVisible();
    
    // Check if total discount is displayed
    const totalDiscountDisplay = page.locator('.result-label').filter({ hasText: 'Desconto Total' });
    await expect(totalDiscountDisplay).toBeVisible();
    
    const totalDiscountAmount = page.locator('.result-value.discount');
    await expect(totalDiscountAmount).toBeVisible();
  });

  test('should validate negative input', async ({ page }) => {
    // Try to input negative values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('-100');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('-10');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('-20');
    
    await page.waitForTimeout(500);
    
    // Check if error messages appear
    await expect(page.locator('.input-error')).toBeVisible();
    
    // Check if negative values are clamped to zero
    await expect(page.locator('input[aria-label="Valor em Dólares (USD)"]')).toHaveValue('0');
  });

  test('should validate percentage limits', async ({ page }) => {
    // Set fees type to percentage
    await page.locator('select[aria-label="Tipo de taxa"]').selectOption('percent');
    
    // Try to input percentage over 100%
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('150');
    
    await page.waitForTimeout(500);
    
    // Check if error message appears
    await expect(page.locator('.input-error')).toBeVisible();
    await expect(page.locator('.input-error')).toContainText('maior que 100%');
  });

  test('should show extra tax section only when extra income is provided', async ({ page }) => {
    // Initially, extra tax section should not be visible
    await expect(page.locator('input[aria-label="Taxa sobre renda extra"]')).not.toBeVisible();
    
    // Add extra income
    await page.locator('input[aria-label="Renda extra"]').fill('100');
    
    await page.waitForTimeout(500);
    
    // Now extra tax section should be visible
    await expect(page.locator('input[aria-label="Taxa sobre renda extra"]')).toBeVisible();
    
    // Remove extra income
    await page.locator('input[aria-label="Renda extra"]').clear();
    
    await page.waitForTimeout(500);
    
    // Extra tax section should be hidden again
    await expect(page.locator('input[aria-label="Taxa sobre renda extra"]')).not.toBeVisible();
  });

  test('should display exchange rate information', async ({ page }) => {
    // Check if exchange rate is displayed
    await expect(page.locator('.work-calculator-rate')).toBeVisible();
    
    // Check if rate format is correct
    const rateText = await page.locator('.work-calculator-rate').textContent();
    expect(rateText).toMatch(/Taxa de câmbio: 1 USD = R\$\s*\d+,\d+/);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check input accessibility
    await expect(page.locator('input[aria-label="Valor em Dólares (USD)"]')).toHaveAttribute('aria-label', 'Valor em Dólares (USD)');
    await expect(page.locator('input[aria-label="Taxas e Comissões"]')).toHaveAttribute('aria-label', 'Taxas e Comissões');
    await expect(page.locator('input[aria-label="Impostos e Outras Taxas"]')).toHaveAttribute('aria-label', 'Impostos e Outras Taxas');
    await expect(page.locator('input[aria-label="Renda extra"]')).toHaveAttribute('aria-label', 'Renda extra');
    
    // Check select accessibility
    await expect(page.locator('select[aria-label="Tipo de taxa"]')).toHaveAttribute('aria-label', 'Tipo de taxa');
    await expect(page.locator('select[aria-label="Moeda da taxa"]')).toHaveAttribute('aria-label', 'Moeda da taxa');
  });

  test('should handle complex calculation scenario', async ({ page }) => {
    // Set up a complex scenario
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('2000');
    
    // Fees as percentage
    await page.locator('select[aria-label="Tipo de taxa"]').selectOption('percent');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('5'); // 5%
    
    // Taxes as fixed value in USD
    await page.locator('select[aria-label="Tipo de imposto"]').selectOption('value');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('200');
    
    // Extra income in BRL
    await page.locator('select[aria-label="Moeda da renda extra"]').selectOption('BRL');
    await page.locator('input[aria-label="Renda extra"]').fill('1000');
    
    // Extra tax as percentage
    await page.locator('select[aria-label="Tipo de taxa sobre renda extra"]').selectOption('percent');
    await page.locator('input[aria-label="Taxa sobre renda extra"]').fill('10'); // 10%
    
    await page.waitForTimeout(500);
    
    // Check if all calculations are displayed
    await expect(page.locator('.result-value.gross')).toBeVisible();
    await expect(page.locator('.result-value.fees')).toBeVisible();
    await expect(page.locator('.result-value.taxes')).toBeVisible();
    await expect(page.locator('.result-value.extra')).toBeVisible();
    await expect(page.locator('.result-value.taxes').last()).toBeVisible();
    await expect(page.locator('.result-value.gross-total')).toBeVisible();
    await expect(page.locator('.result-value.discount')).toBeVisible();
    await expect(page.locator('.result-value.net')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if calculator is still visible and properly sized
    await expect(page.locator('.work-calculator-card')).toBeVisible();
    
    // Test basic functionality on mobile
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('500');
    await page.waitForTimeout(500);
    
    const netAmount = page.locator('.result-value.net');
    await expect(netAmount).toBeVisible();
  });

  test('should prevent plus and minus key input', async ({ page }) => {
    const grossInput = page.locator('input[aria-label="Valor em Dólares (USD)"]');
    
    await grossInput.click();
    
    // Try to type plus and minus keys
    await grossInput.press('+');
    await grossInput.press('-');
    
    // Check if the input remains empty
    await expect(grossInput).toHaveValue('');
  });

  test('should handle decimal input correctly', async ({ page }) => {
    // Test decimal input
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('999.99');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('12.5');
    
    await page.waitForTimeout(500);
    
    // Check if calculations work with decimals
    const netAmount = page.locator('.result-value.net');
    await expect(netAmount).toBeVisible();
    await expect(netAmount).not.toContainText('R$ 0,00');
  });

  test('should maintain state during interactions', async ({ page }) => {
    // Fill in values
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1500');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('75');
    
    await page.waitForTimeout(500);
    
    const initialNetAmount = await page.locator('.result-value.net').textContent();
    
    // Click on another component
    await page.locator('.exchange-card').click();
    
    // Check if values are maintained
    await expect(page.locator('input[aria-label="Valor em Dólares (USD)"]')).toHaveValue('1500');
    await expect(page.locator('input[aria-label="Taxas e Comissões"]')).toHaveValue('75');
    await expect(page.locator('.result-value.net')).toContainText(initialNetAmount);
  });
});
