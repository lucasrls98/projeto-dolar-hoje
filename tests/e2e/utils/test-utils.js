// Test utilities for Playwright E2E tests
export class TestUtils {
  static async waitForExchangeRate(page, timeout = 10000) {
    await page.waitForSelector('.rate-value', { timeout });
  }

  static async fillConverterInput(page, amount) {
    await page.locator('.converter-card input.amount-input').fill(amount);
    await page.waitForTimeout(500);
  }

  static async fillWorkCalculatorInputs(page, inputs) {
    if (inputs.grossAmount) {
      await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill(inputs.grossAmount);
    }
    if (inputs.fees) {
      await page.locator('input[aria-label="Taxas e Comissões"]').fill(inputs.fees);
    }
    if (inputs.taxes) {
      await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill(inputs.taxes);
    }
    if (inputs.extraIncome) {
      await page.locator('input[aria-label="Renda extra"]').fill(inputs.extraIncome);
    }
    await page.waitForTimeout(500);
  }

  static async simulateApiError(page) {
    await page.route('**/api.exchangerate-api.com/**', route => route.abort('failed'));
  }

  static async restoreApi(page) {
    await page.unroute('**/api.exchangerate-api.com/**');
  }

  static async simulateSlowApi(page, delay = 2000) {
    await page.route('**/api.exchangerate-api.com/**', async route => {
      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
  }

  static parseCurrencyValue(text) {
    return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  static async getExchangeRate(page) {
    const rateText = await page.locator('.rate-value').textContent();
    return this.parseCurrencyValue(rateText);
  }

  static async getConvertedAmount(page) {
    const amountText = await page.locator('.converted-amount').textContent();
    return this.parseCurrencyValue(amountText);
  }

  static async getNetAmount(page) {
    const amountText = await page.locator('.result-value.net').textContent();
    return this.parseCurrencyValue(amountText);
  }
}
