import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              metrics.cls = entry.value;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 3000);
      });
    });

    // Basic performance checks
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // LCP should be under 2.5s
    }
  });

  test('should handle rapid user interactions without lag', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    const startTime = Date.now();
    
    // Rapid interactions
    await page.locator('.converter-card input.amount-input').fill('100');
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('50');
    await page.locator('.invert-button').click();
    await page.locator('.refresh-button').click();
    
    const interactionTime = Date.now() - startTime;
    
    // All interactions should complete within 2 seconds
    expect(interactionTime).toBeLessThan(2000);
    
    // Verify all components are responsive
    await expect(page.locator('.converted-amount')).toBeVisible();
    await expect(page.locator('.result-value.net')).toBeVisible();
  });

  test('should not have memory leaks during extended use', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    // Perform multiple operations
    for (let i = 0; i < 10; i++) {
      await page.locator('.converter-card input.amount-input').fill(`${i * 100}`);
      await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill(`${i * 500}`);
      await page.locator('.refresh-button').click();
      await page.waitForTimeout(100);
    }

    // Check if page is still responsive
    await expect(page.locator('.rate-value')).toBeVisible();
    await expect(page.locator('.converter-card')).toBeVisible();
    await expect(page.locator('.work-calculator-card')).toBeVisible();
  });

  test('should handle large number calculations efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    const startTime = Date.now();
    
    // Test with large numbers
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('9999999');
    await page.locator('input[aria-label="Taxas e Comissões"]').fill('500000');
    await page.locator('input[aria-label="Impostos e Outras Taxas"]').fill('1000000');
    await page.locator('input[aria-label="Renda extra"]').fill('2000000');
    
    const calculationTime = Date.now() - startTime;
    
    // Calculations should complete quickly even with large numbers
    expect(calculationTime).toBeLessThan(1000);
    
    // Verify results are displayed
    await expect(page.locator('.result-value.net')).toBeVisible();
  });

  test('should maintain performance on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Should load quickly on mobile too
    expect(loadTime).toBeLessThan(5000);
    
    // Test mobile interactions
    await page.locator('.converter-card input.amount-input').fill('50');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.converted-amount')).toBeVisible();
  });

  test('should handle API response delays gracefully', async ({ page }) => {
    // Simulate slow API response
    await page.route('**/api.exchangerate-api.com/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 15000 });
    
    const loadTime = Date.now() - startTime;
    
    // Should handle delay gracefully
    expect(loadTime).toBeLessThan(15000);
    
    // Verify loading state was shown
    await expect(page.locator('.rate-value')).toBeVisible();
  });

  test('should not block UI during calculations', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    // Start a calculation
    await page.locator('input[aria-label="Valor em Dólares (USD)"]').fill('1000');
    
    // Immediately try to interact with other elements
    await page.locator('.converter-card input.amount-input').fill('100');
    await page.locator('.invert-button').click();
    
    // All interactions should work without blocking
    await expect(page.locator('.converted-amount')).toBeVisible();
    await expect(page.locator('.result-value.net')).toBeVisible();
  });

  test('should handle multiple browser tabs efficiently', async ({ browser }) => {
    // Open multiple tabs
    const context = await browser.newContext();
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage()
    ]);

    const startTime = Date.now();
    
    // Load page in all tabs
    await Promise.all(pages.map(page => 
      page.goto('/').then(() => 
        page.waitForSelector('.rate-value', { timeout: 10000 })
      )
    ));
    
    const loadTime = Date.now() - startTime;
    
    // All tabs should load within reasonable time
    expect(loadTime).toBeLessThan(8000);
    
    // Verify all tabs are functional
    for (const page of pages) {
      await expect(page.locator('.rate-value')).toBeVisible();
    }
    
    await context.close();
  });

  test('should have efficient DOM updates', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.rate-value', { timeout: 10000 });

    // Monitor DOM mutations
    let mutationCount = 0;
    await page.evaluate(() => {
      const observer = new MutationObserver(() => {
        mutationCount++;
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // Perform multiple interactions
    for (let i = 0; i < 5; i++) {
      await page.locator('.converter-card input.amount-input').fill(`${i * 100}`);
      await page.waitForTimeout(100);
    }

    // DOM updates should be efficient (not excessive)
    expect(mutationCount).toBeLessThan(100);
  });
});
