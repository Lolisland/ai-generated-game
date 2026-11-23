import { test, expect } from '@playwright/test';

test('reactive field preserves movement, bloom, awakening and reset', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/field-desktop.png' });
  await page.getByRole('button', { name: 'Bloom' }).click();
  await expect(page.locator('#status')).toHaveText('The seed has bloomed.');
  await page.locator('body').click({ position: { x: 15, y: 15 } });
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(1670);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(1200);
  await page.keyboard.up('ArrowUp');
  await expect(page.locator('#hint')).toHaveText('You became a light');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: 'test-results/field-awake.png' });
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.locator('#hint')).toHaveText('Find the standing stone');
  await page.getByRole('button', { name: 'Effects: full' }).click();
  await expect(page.locator('#intensity')).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(200);
  const still = await page.locator('canvas').screenshot();
  await page.waitForTimeout(300);
  expect(await page.locator('canvas').screenshot()).toEqual(still);
  expect(errors).toEqual([]);
});

test('mobile reduced-motion mode remains playable with touch', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Effects: gentle' })).toBeVisible();
  await page.getByRole('button', { name: 'Bloom' }).tap();
  await expect(page.locator('#status')).toHaveText('The seed has bloomed.');
  await page.screenshot({ path: 'test-results/field-mobile.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
