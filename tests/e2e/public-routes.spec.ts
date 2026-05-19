import { test, expect } from '@playwright/test';

test('landing page loads successfully', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  // Check for hero elements
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Ensure linear glassmorphism features render
  await expect(page.locator('.hero-badge')).toBeVisible();
});

test('news feed is accessible to public', async ({ page }) => {
  await page.goto('/news');

  await expect(page.getByRole('heading', { name: /News & Activities|Activity Reports/i })).toBeVisible();
  
  // It shouldn't crash if empty or populated
  const hasArticles = await page.locator('.article-card').count() > 0;
  const hasEmptyState = await page.getByText(/No articles found/i).isVisible();
  
  expect(hasArticles || hasEmptyState).toBeTruthy();
});
