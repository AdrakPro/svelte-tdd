import { render, screen } from '@testing-library/svelte';
import Birthday from '$lib/Birthday.svelte';

describe('Birthday.svelte component', () => {
  const examplePerson = { name: 'John', dob: '10-01-2000' };

  it('should display a person name', () => {
    render(Birthday, examplePerson);
    expect(screen.queryByText('John')).toBeVisible();
  });

  it('should display person dob', () => {
    render(Birthday, examplePerson)
    expect(screen.queryByText('10-01-2000')).toBeVisible();
  });

  it('should display another peron name', () => {
    render(Birthday, { ...examplePerson, name: 'Adam' });
    expect(screen.queryByText('Adam')).toBeVisible();
  });

  it('should display another person dob', () => {
    render(Birthday, { ...examplePerson, dob: '11-01-2000' });
    expect(screen.queryByText('11-01-2000')).toBeVisible();
  });
});
