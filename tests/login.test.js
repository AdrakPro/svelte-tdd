import { test, expect } from '@playwright/test';

test('does not log in if log in fails', async ({
  page
}) => {
  await page.goto('/birthdays');
  await expect(page.getByText('Login')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('button', {
      name: /Sign in/i
    })
    .click();
  await page.getByRole('textbox').fill('unknown user');
  await page
    .getByRole('button', {
      name: /Sign in with Credentials/i
    })
    .click();
  await expect(
    page.getByText(
      'Sign in failed. Check the details you provided are correct.'
    )
  ).toBeVisible();
});
