import {
  actions,
  load
} from '$routes/birthdays/+page.server.js';
import { createFormDataRequest } from '$factories/formDataRequest.js';
import { beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BirthdayForm from '$lib/BirthdayForm.svelte';
import * as birthdayRepository from '$lib/server/birthdayRepository.js';
import { createBirthday } from '$factories/birthday.js';

describe('/birthdays - load', () => {
  it('should return a fixture of two items', () => {
    const { birthdays } = load();
    expect(birthdays).toEqual([
      expect.objectContaining({
        name: 'Hercules',
        dob: '1994-02-02'
      }),
      expect.objectContaining({
        name: 'Athena',
        dob: '1989-01-01'
      })
    ]);
  });
});

describe('/birthdays - default action', () => {
  beforeEach(birthdayRepository.clear);

  const performFormAction = (formData) =>
    actions.default({
      request: createFormDataRequest(formData)
    });

  const storedId = () => birthdayRepository.getAll()[0].id;

  it('should add a new birthday into the list', async () => {
    await performFormAction(
      createBirthday('Zeus', '2009-02-02')
    );
    expect(birthdayRepository.getAll()).toContainEqual(
      expect.objectContaining({
        name: 'Zeus',
        dob: '2009-02-02'
      })
    );
  });

  it('should save an unique ids onto each new birthday', async () => {
    const request = createBirthday('Zeus', '2009-02-02');

    await performFormAction(request);
    await performFormAction(request);
    expect(birthdayRepository.getAll()[0].id).not.toEqual(
      birthdayRepository.getAll()[1].id
    );
  });

  it('should update an entry that shares the same id', async () => {
    await performFormAction(
      createBirthday('Zeus', '2009-02-02')
    );
    await performFormAction(
      createBirthday('Zeus Ex', '2007-02-02', {
        id: storedId()
      })
    );
    expect(birthdayRepository.getAll()).toHaveLength(1);
    expect(birthdayRepository.getAll()).toContainEqual({
      id: storedId(),
      name: 'Zeus Ex',
      dob: '2007-02-02'
    });
  });

  describe('validation errors', () => {
    describe('when the name is not provided', () => {
      let result;

      beforeEach(async () => {
        result = await performFormAction(
          createBirthday('', '2009-02-02')
        );
      });

      it('should not save the birthday', () => {
        expect(load().birthdays).not.toContainEqual(
          expect.objectContaining({
            name: '',
            dob: '2009-02-02'
          })
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
      let result;

      beforeEach(async () => {
        result = await performFormAction(
          createBirthday('Hercules', 'unknown')
        );
      });

      it('should not save the birthday', () => {
        expect(
          birthdayRepository.getAll()
        ).not.toContainEqual(
          expect.objectContaining({
            name: 'Hercules',
            dob: 'unknown'
          })
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

    describe('when the id is unknown', () => {
      let result;
      beforeEach(async () => {
        result = await performFormAction(
          createBirthday('Hercules', '2009-01-01', {
            id: 'unknown'
          })
        );
      });

      it('should not save the birthday', () => {
        expect(load().birthdays).not.toContainEqual(
          expect.objectContaining({
            name: 'Hercules',
            dob: 'unknown'
          })
        );
      });

      it('should return a 422 code', () => {
        expect(result.status).toEqual(422);
      });

      it('should return a useful message', () => {
        expect(result.data.error).toEqual(
          'An unknown ID was provided.'
        );
      });
    });

    describe('when replacing an item', () => {
      beforeEach(async () => {
        await performFormAction(
          createBirthday('Hercules', '2009-01-02')
        );
      });

      it('should return the id when an empty name is provided', async () => {
        const result = await performFormAction(
          createBirthday('', '1982-05-01', {
            id: storedId()
          })
        );
        expect(result.data).toContain({ id: storedId() });
      });

      it('should return the id when an empty date of birth is provided', async () => {
        const result = await performFormAction(
          createBirthday('Hercules', '', { id: storedId() })
        );
        expect(result.data).toContain({ id: storedId() });
      });
    });
  });
});
