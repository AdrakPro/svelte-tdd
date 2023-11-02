import Page from '$routes/birthdays/+page.svelte';
import { render, screen } from '@testing-library/svelte';
import { createFormDataRequest } from '../../../factories/formDataRequest.js';
import {
  actions,
  load
} from '$routes/birthdays/+page.server.js';

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

  it('should display a form for adding new birthday', () => {
    render(Page, { data: { birthdays } });
    expect(screen.queryByRole('form')).toBeVisible();
  });
});

describe('/birthdays - default action', () => {
  const person = {
    name: 'Zeus',
    dob: '2009-02-02'
  };

  it('should add a new birthday into the list', async () => {
    const request = createFormDataRequest(person);

    await actions.default({ request });
    expect(load().birthdays).toContainEqual(
      expect.objectContaining(person)
    );
  });
});
