import { expect, test } from '@playwright/test';

test('lists all birthdays', async ({ page }) => {
  await page.goto('/birthdays');
  await expect(page.getByText('Athena')).toBeVisible();
  await expect(page.getByText('Hercules')).toBeVisible();
});

test('saves a new birthday', async ({ page }) => {
  await page.goto('/birthdays');
  await page.getByLabel('Name').fill('Persephone');
  await page.getByLabel('Date of birth').fill('1985-01-01');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Persephone')).toBeVisible();
});

test('does not save a birthday if there are validation errors', async ({
  page
}) => {
  await page.goto('/birthdays');
  await page.getByLabel('Name').fill('Persephone');
  await page.getByLabel('Date of birth').fill('invalid');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.getByText('Persephone')
  ).not.toBeVisible();
  await expect(
    page.getByText(
      'Please provide a date of birth in the YYYY-MM-DD format'
    )
  ).toBeVisible();
});

test('edits a birthday', async ({ page }) => {
  await page.goto('/birthdays');
  await page.getByLabel('Name').fill('Persephone');
  await page.getByLabel('Date of birth').fill('1985-01-01');
  await page.getByRole('button', { name: 'Save' }).click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Persephone' })
    .getByRole('button', { name: 'Edit' })
    .click();
  await page.getByLabel('Date of birth').fill('1995-01-01');
  await page.getByRole('button', { name: 'Save' }).click();

  // refactor this
  await expect(
    page
      .getByRole('listitem')
      .filter({ hasText: 'Persephone' })
  ).not.toContainText('1985-01-01');
  await expect(
    page
      .getByRole('listitem')
      .filter({ hasText: 'Persephone' })
  ).toContainText('1995-01-01');
});
