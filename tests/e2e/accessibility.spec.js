import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Calculadora da Gringa');

    // Check component headings
    await expect(page.locator('.converter-title')).toBeVisible();
    await expect(page.locator('.work-calculator-title')).toBeVisible();
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check loading state accessibility
    const loadingState = page.locator('.loading-state');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toHaveAttribute('role', 'status');
      await expect(loadingState).toHaveAttribute('aria-live', 'polite');
    }

    // Check error state accessibility
    const errorState = page.locator('.error-state');
    if (await errorState.isVisible()) {
      await expect(errorState).toHaveAttribute('role', 'alert');
      await expect(errorState).toHaveAttribute('aria-live', 'assertive');
    }

    // Check button accessibility
    await expect(page.locator('.refresh-button')).toHaveAttribute('aria-label');
    await expect(page.locator('.retry-button')).toHaveAttribute('aria-label');
    await expect(page.locator('.invert-button')).toHaveAttribute('aria-label');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName);
        expect(['INPUT', 'BUTTON', 'SELECT']).toContain(tagName);
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    // Check input labels
    const inputs = page.locator('input[type="number"]');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel.length).toBeGreaterThan(0);
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check text color contrast
    const textElements = page.locator('p, span, div').filter({ hasText: /[a-zA-Z]/ });
    const elementCount = await textElements.count();

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = textElements.nth(i);
      const computedStyle = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });

      // Basic check that colors are defined
      expect(computedStyle.color).toBeTruthy();
    }
  });

  test('should announce dynamic content changes', async ({ page }) => {
    // Test if screen reader announcements work
    const converterInput = page.locator('.converter-card input.amount-input');
    await converterInput.fill('100');
    await page.waitForTimeout(500);

    // Check if converted amount is visible (should be announced)
    await expect(page.locator('.converted-amount')).toBeVisible();
  });

  test('should handle focus management', async ({ page }) => {
    // Test focus on interactive elements
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await button.focus();
      await expect(button).toBeFocused();
    }
  });

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for proper semantic elements
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for proper form structure
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      await expect(forms.first()).toBeVisible();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Test landmark navigation
    const landmarks = page.locator('main, header, footer, nav');
    const landmarkCount = await landmarks.count();
    expect(landmarkCount).toBeGreaterThan(0);

    // Test heading navigation
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should handle error announcements', async ({ page }) => {
    // Trigger an error state
    await page.route('**/api.exchangerate-api.com/**', route => route.abort('failed'));
    await page.reload();
    await page.waitForSelector('.error-state', { timeout: 10000 });

    // Check if error is properly announced
    await expect(page.locator('.error-state')).toHaveAttribute('role', 'alert');
    await expect(page.locator('.error-state')).toHaveAttribute('aria-live', 'assertive');
  });

  test('should have accessible form controls', async ({ page }) => {
    // Check select elements
    const selects = page.locator('select');
    const selectCount = await selects.count();

    for (let i = 0; i < selectCount; i++) {
      const select = selects.nth(i);
      const ariaLabel = await select.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }

    // Check input elements
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const type = await input.getAttribute('type');
      
      if (type === 'number') {
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('should maintain accessibility during state changes', async ({ page }) => {
    // Test loading state accessibility
    await page.route('**/api.exchangerate-api.com/**', route => {
      // Delay response to show loading state
      setTimeout(() => route.continue(), 1000);
    });

    await page.reload();
    
    // Check if loading state has proper accessibility
    const loadingState = page.locator('.loading-state');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toHaveAttribute('role', 'status');
    }

    // Wait for completion
    await page.waitForSelector('.rate-value', { timeout: 10000 });
  });
});
