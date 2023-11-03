import { expect, test } from '@playwright/test';
import { BirthdayListPage } from './BirthdayListPage.js';

test('lists all birthdays', async ({ page }) => {
  const birthdayListPage = new BirthdayListPage(page);
  await birthdayListPage.goto();
  await expect(
    birthdayListPage.entryFor('Athena')
  ).toBeVisible();
  await expect(
    birthdayListPage.entryFor('Hercules')
  ).toBeVisible();
});

test('saves a new birthday', async ({ page }) => {
  const birthdayListPage = new BirthdayListPage(page);
  await birthdayListPage.goto();
  await birthdayListPage.saveNameAndDateOfBirth(
    'Persephone',
    '1985-01-01'
  );
  await expect(
    birthdayListPage.entryFor('Persephone')
  ).toBeVisible();
});

test('does not save a birthday if there are validation errors', async ({
  page
}) => {
  const birthdayListPage = new BirthdayListPage(page);
  await birthdayListPage.goto();
  await birthdayListPage.saveNameAndDateOfBirth(
    'Persephone',
    'invalid'
  );
  await expect(
    birthdayListPage.entryFor('Persephone')
  ).not.toBeVisible();
  await expect(
    page.getByText(
      'Please provide a date of birth in the YYYY-MM-DD format'
    )
  ).toBeVisible();
});

test('edits a birthday', async ({ page }) => {
  const birthdayListPage = new BirthdayListPage(page);
  await birthdayListPage.goto();
  await birthdayListPage.saveNameAndDateOfBirth(
    'Persephone',
    '1985-01-01'
  );
  await birthdayListPage.beginEditingFor('Persephone');
  await birthdayListPage.saveNameAndDateOfBirth(
    'Persephone',
    '1995-01-01'
  );

  await expect(
    birthdayListPage.entryFor('Persephone')
  ).not.toContainText('1985-01-01');
  await expect(
    birthdayListPage.entryFor('Persephone')
  ).toContainText('1995-01-01');
});
