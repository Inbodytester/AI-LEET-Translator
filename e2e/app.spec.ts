import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/translate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        detectedLanguage: 'English',
        leetTranslation: 'h3ll0 w0rld',
      }),
    });
  });
});

test('homepage loads with translator UI', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI L33T Tr4nsl4t0r/i })).toBeVisible();
  await expect(page.getByLabel(/enter text to translate/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /tr4nsl4t3/i })).toBeDisabled();
});

test('translates text with mocked API', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/enter text to translate/i).fill('hello world');
  await page.getByRole('button', { name: /tr4nsl4t3/i }).click();

  await expect(page.locator('p.whitespace-pre-wrap')).toHaveText('h3ll0 w0rld', { timeout: 10_000 });
  await expect(page.getByText(/detected:/i)).toBeVisible();
});

test('toggles dark mode', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');

  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(html).toHaveClass(/dark/);
});

test('log modal traps focus and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /view application logs/i }).click();

  const dialog = page.getByRole('dialog', { name: /application logs/i });
  await expect(dialog).toBeVisible();

  await expect(dialog.getByRole('button', { name: /clear all logs/i })).toBeFocused();

  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    const focusInsideDialog = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]');
      return dialogEl?.contains(document.activeElement) ?? false;
    });
    expect(focusInsideDialog).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});