import { render, screen } from '@testing-library/svelte';
import Birthday from '$lib/Birthday.svelte';
import { createBirthday } from '$factories/birthday.js';

describe('Birthday.svelte', () => {
  it('should display a person name', () => {
    render(Birthday, createBirthday('John', '10-01-2000'));
    expect(screen.queryByText('John')).toBeVisible();
  });

  it('should display person dob', () => {
    render(Birthday, createBirthday('John', '10-01-2000'));
    expect(screen.queryByText('10-01-2000')).toBeVisible();
  });

  it('should display another peron name', () => {
    render(Birthday, createBirthday('Adam', '10-01-2000'));
    expect(screen.queryByText('Adam')).toBeVisible();
  });

  it('should display another person dob', () => {
    render(Birthday, createBirthday('John', '11-01-2000'));
    expect(screen.queryByText('11-01-2000')).toBeVisible();
  });
});
