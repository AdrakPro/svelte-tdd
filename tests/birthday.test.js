import { expect, test } from '@playwright/test';

test('lists all birthdays', async ({ page }) => {
  await page.goto('/birthdays');
  await expect(page.getByText('John')).toBeVisible();
  await expect(page.getByText('Hercules')).toBeVisible();
});
