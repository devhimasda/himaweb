import { test, expect } from '@playwright/test';

test('login page should have required inputs', async ({ page }) => {
  await page.goto('/login');
  
  await expect(page.getByRole('heading', { name: /HIMA Admin/i })).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /Sign In|Login/i })).toBeVisible();
});

test('submitting wrong credentials should show error', async ({ page }) => {
  await page.goto('/login');
  
  await page.locator('input[type="email"]').fill('hacker@hima.org');
  await page.locator('input[type="password"]').fill('wrongpassword123');
  await page.getByRole('button', { name: /Sign In|Login/i }).click();

  // The login UI should display an error message
  await expect(page.locator('.login-form > div').first()).toBeVisible({ timeout: 10000 });
});

test('unauthenticated users should be redirected from admin', async ({ page }) => {
  const response = await page.goto('/admin');
  
  // They should be bounced to /login
  await expect(page).toHaveURL(/.*\/login/);
});
