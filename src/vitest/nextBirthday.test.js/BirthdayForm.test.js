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

    it('should has a default blank value', () => {
      render(BirthdayForm);
      expect(screen.queryByLabelText('Name')).toHaveValue(
        ''
      );
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

    it('should has a default blank value', () => {
      render(BirthdayForm);
      expect(
        screen.queryByLabelText('Date of birth')
      ).toHaveValue('');
    });
  });

  describe('id field', () => {
    it('should contain a hidden field for the id if an id is given', () => {
      render(BirthdayForm, { form: { id: '123' } });
      expect(
        document.forms.birthday.elements.id.value
      ).toEqual('123');
    });

    it('should not include the id field if no id is present', () => {
      render(BirthdayForm);
      expect(
        document.forms.birthday.elements.id
      ).not.toBeDefined();
    });
  });
});
