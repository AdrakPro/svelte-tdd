import BirthdayForm from '$lib/BirthdayForm.svelte';
import { render, screen } from '@testing-library/svelte';

describe('BirthdayForm.svelte', () => {
  it('should display a form', () => {
    render(BirthdayForm);
    expect(screen.queryByRole('form')).toBeVisible();
  });

  it('should has a POST method', () => {
    render(BirthdayForm);
    expect(screen.queryByRole('form').method).toEqual(
      'post'
    );
  });

  it('should has a submit button', () => {
    render(BirthdayForm);
    expect(screen.queryByRole('button')).toBeVisible();
  });

  describe('name field', () => {
    it('should display a text field for the contact name', () => {
      render(BirthdayForm);
      const field = screen.queryByLabelText('Name', {
        selector: 'input[type=text]'
      });
      expect(field).toBeVisible();
      expect(field.name).toEqual('name');
    });
  });

  describe('date of birth field', () => {
    it('should display a text field for the date of birth', () => {
      render(BirthdayForm);
      const field = screen.queryByLabelText(
        'Date of birth',
        { selector: 'input[type=text]' }
      );
      expect(field).toBeVisible();
      expect(field.name).toEqual('dob');
    });
  });
});
