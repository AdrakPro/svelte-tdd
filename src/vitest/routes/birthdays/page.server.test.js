import {
  actions,
  load
} from '$routes/birthdays/+page.server.js';
import { createFormDataRequest } from '../../../factories/formDataRequest.js';
import { beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BirthdayForm from '$lib/BirthdayForm.svelte';
import * as birthdayRepository from '$lib/server/birthdayRepository.js';

describe('/birthdays - load', () => {
  it('should return a fixture of two items', () => {
    const { birthdays } = load();
    expect(birthdays).toEqual([
      { name: 'Hercules', dob: '1994-02-02' },
      { name: 'Athena', dob: '1989-01-01' }
    ]);
  });
});

describe('/birthdays - default action', () => {
  beforeEach(birthdayRepository.clear);
  const person = {
    name: 'Zeus',
    dob: '2009-02-02'
  };

  it('should add a new birthday into the list', async () => {
    const request = createFormDataRequest(person);

    await actions.default({ request });
    expect(birthdayRepository.getAll()).toContainEqual(
      expect.objectContaining(person)
    );
  });

  describe('validation errors', () => {
    describe('when the name is not provided', () => {
      const invalidPerson = { name: '', dob: '2009-02-02' };
      let result;

      beforeEach(async () => {
        const request =
          createFormDataRequest(invalidPerson);
        result = await actions.default({ request });
      });

      it('should not save the birthday', () => {
        expect(
          birthdayRepository.getAll()
        ).not.toContainEqual(
          expect.objectContaining(invalidPerson)
        );
      });

      it('should return a 422 code', () => {
        expect(result.status).toEqual(422);
      });

      it('should return a useful message', () => {
        expect(result.data.error).toEqual(
          'Please provide a name.'
        );
      });

      it('should return the data back', () => {
        expect(result.data).toContain({
          dob: '2009-02-02'
        });
      });
    });

    describe('when the date of birth is not provided', () => {
      const invalidPerson = {
        name: 'Hercules',
        dob: 'unknown'
      };
      let result;

      beforeEach(async () => {
        const request =
          createFormDataRequest(invalidPerson);
        result = await actions.default({ request });
      });

      it('should not save the birthday', () => {
        expect(
          birthdayRepository.getAll()
        ).not.toContainEqual(
          expect.objectContaining(invalidPerson)
        );
      });

      it('should return a 422 code', () => {
        expect(result.status).toEqual(422);
      });

      it('should return a useful message', () => {
        expect(result.data.error).toEqual(
          'Please provide a date of birth in the YYYY-MM-DD format.'
        );
      });

      it('should return the data back, including the incorrect one', () => {
        expect(result.data).toContain({
          name: 'Hercules',
          dob: 'unknown'
        });
      });
    });
    it('should display a message', () => {
      render(BirthdayForm, { form: { error: 'An error' } });
      expect(screen.queryByText('An error')).toBeVisible();
    });

    it('should keep the previous name value when an error occurs', () => {
      render(BirthdayForm, {
        form: { name: 'Hercules', error: 'An error' }
      });
      expect(screen.queryByLabelText('Name')).toHaveValue(
        'Hercules'
      );
    });

    it('should keep the previous dob value when an error occurs', () => {
      render(BirthdayForm, {
        form: { dob: '2000-01-01', error: 'An error' }
      });
      expect(
        screen.queryByLabelText('Date of birth')
      ).toHaveValue('2000-01-01');
    });
  });
});
