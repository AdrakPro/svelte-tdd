import { vi } from 'vitest';
import { birthdays as birthdaysStore } from '$stores/birthdays.js';
import { createBirthday } from '$factories/birthday.js';
import { render } from '@testing-library/svelte';
import NextBirthday from '$lib/NextBirthday.svelte';

const julyOfYear = (year) => {
  const date = new Date();
  date.setFullYear(year, 6, 1);
  return date;
};

describe('NextBirthday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(julyOfYear(2056));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display a single birthday', () => {
    birthdaysStore.set([
      createBirthday('Hercules', '2023-09-03')
    ]);
    render(NextBirthday);
    expect(document.body).toHaveTextContent(
      'Hercules has the next birthday, on 2056-09-03'
    );
  });

  it('should update the displayed data when the store is updated', async () => {
    birthdaysStore.set([
      createBirthday('Hercules', '2023-09-01')
    ]);
    render(NextBirthday);
    await birthdaysStore.set([
      createBirthday('Hercules', '2023-09-01'),
      createBirthday('Ares', '2023-08-01')
    ]);
    expect(document.body).toHaveTextContent(
      'Ares has the next birthday, on 2056-08-01'
    );
  });
});
