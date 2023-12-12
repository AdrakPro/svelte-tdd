import { vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createBirthday } from '$factories/birthday.js';
import Page from '$routes/birthdays/+page.svelte';
import Birthday from '$lib/Birthday.svelte';
import BirthdayForm from '$lib/BirthdayForm.svelte';
import { click } from '@testing-library/user-event';

vi.mock(
  '$nextBirthday.test.js/Birthday.svelte',
  async () => ({
    default: componentDouble('Birthday')
  })
);

vi.mock(
  '$nextBirthday.test.js/BirthdayForm.svelte',
  async () => ({
    default: componentDouble('BirthdayForm')
  })
);

const firstEditButton = () =>
  screen.queryAllByRole('button', {
    name: 'Edit'
  })[0];

describe('/birthdays', () => {
  beforeEach(Birthday.reset);
  beforeEach(BirthdayForm.reset);

  const birthdays = [
    createBirthday('Hercules', '1994-02-02', {
      id: '123'
    }),
    createBirthday('Athena', '1989-01-01', {
      id: '234'
    })
  ];

  it('should display a Birthday component for each birthday', () => {
    render(Page, { data: { birthdays } });
    expect(Birthday).toBeRenderedWithProps({
      name: 'Hercules',
      dob: '1994-02-02'
    });
    expect(Birthday).toBeRenderedWithProps({
      name: 'Athena',
      dob: '1989-01-01'
    });
  });

  it('should display the Birthdays in the same order as the props passed in', () => {
    render(Page, { data: { birthdays } });
    expect(Birthday.propsOfAllInstances()).toEqual([
      expect.objectContaining({ name: 'Hercules' }),
      expect.objectContaining({ name: 'Athena' })
    ]);
  });

  it('should pass the currently edited birthday to the BirthdayForm component', async () => {
    render(Page, { data: { birthdays } });
    await click(firstEditButton());
    expect(BirthdayForm).toBeRenderedWithProps({
      form: birthdays[0]
    });
  });

  it('should cancel editing', async () => {
    render(Page, { data: { birthdays } });
    await click(firstEditButton());
    await BirthdayForm.dispatch('cancel');
    expect(BirthdayForm).not.toBeRenderedWithProps({
      form: birthdays[0]
    });
  });
});
