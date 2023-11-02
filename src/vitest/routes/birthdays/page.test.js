import Page from '$routes/birthdays/+page.svelte';
import { render, screen } from '@testing-library/svelte';

describe('/birthdays', () => {
  const birthdays = [
    { name: 'Hercules', dob: '1994-02-02' },
    { name: 'Athena', dob: '1989-01-01' }
  ];

  it('should display birthday list', () => {
    render(Page, { data: { birthdays } });
    expect(screen.queryByText('Hercules')).toBeVisible();
    expect(screen.queryByText('Athena')).toBeVisible();
  });
});
