import { beforeEach } from 'vitest';
import {
  addNew,
  clear,
  getAll,
  replace
} from '$lib/server/birthdayRepository.js';
import { createBirthday } from '$factories/birthday.js';

describe('birthdayRepository', () => {
  beforeEach(clear);
  const storedId = () => getAll()[0].id;

  describe('addNew', () => {
    it('should be initially empty', () => {
      expect(getAll()).toHaveLength(0);
    });

    it('should add a new birthday into the list', () => {
      addNew(createBirthday('Zeus', '2009-02-02'));
      expect(getAll()).toContainEqual(
        expect.objectContaining({
          name: 'Zeus',
          dob: '2009-02-02'
        })
      );
    });

    it('should save unique ids onto each new birthday', () => {
      addNew(createBirthday('Zeus', '2009-02-02'));
      addNew(createBirthday('Athena', '2009-02-02'));

      expect(getAll()[0].id).not.toEqual(getAll()[1].id);
    });

    it('should return the added birthday with its id', () => {
      expect(
        addNew(createBirthday('Zeus', '2009-02-02'))
      ).toEqual({
        id: storedId(),
        name: 'Zeus',
        dob: '2009-02-02'
      });
    });

    describe('validation errors', () => {
      describe('when the name is not provided', () => {
        let result;
        beforeEach(() => {
          result = addNew(createBirthday('', '1991-05-06'));
        });

        it('should not save the birthday', () => {
          expect(getAll()).toHaveLength(0);
        });

        it('should return an error', () => {
          expect(result).toEqual({
            error: 'Please provide a name.'
          });
        });
      });

      describe('when the date of birth is in the right format', () => {
        let result;
        beforeEach(() => {
          result = addNew(
            createBirthday('Hercules', 'unknown')
          );
        });

        it('should not save the birthday', () => {
          expect(getAll()).toHaveLength(0);
        });

        it('should return an error', () => {
          expect(result).toEqual({
            error:
              'Please provide a date of birth in the YYYY-MM-DD format.'
          });
        });
      });
    });
  });

  describe('replace', () => {
    beforeEach(() =>
      addNew(createBirthday('Zeus', '2009-02-02'))
    );

    it('should update an entry that shares the same id', () => {
      replace(
        storedId(),
        createBirthday('Zeus Ex', '2007-02-02')
      );

      expect(getAll()).toHaveLength(1);
      expect(getAll()).toContainEqual({
        id: storedId(),
        name: 'Zeus Ex',
        dob: '2007-02-02'
      });
    });

    it('should return the updated birthday', () => {
      expect(
        replace(
          storedId(),
          createBirthday('Zeus Ex', '2009-02-02')
        )
      ).toEqual({
        id: storedId(),
        name: 'Zeus Ex',
        dob: '2009-02-02'
      });
    });

    describe('validation errors', () => {
      describe('when the name is not provided', () => {
        let result;
        beforeEach(() => {
          result = replace(
            storedId(),
            createBirthday('', '1991-05-06')
          );
        });

        it('should not update the birthday', () => {
          expect(getAll()[0].name).toEqual('Zeus');
        });

        it('should return an error', () => {
          expect(result).toEqual({
            error: 'Please provide a name.'
          });
        });
      });
    });

    describe('when the date of birth is in the wrong format', () => {
      let result;
      beforeEach(() => {
        result = replace(
          storedId(),
          createBirthday('Zeus', 'unknown')
        );
      });

      it('should not update the birthday', () => {
        expect(getAll()[0].dob).toEqual('2009-02-02');
      });

      it('should return an error', () => {
        expect(result).toEqual({
          error:
            'Please provide a date of birth in the YYYY-MM-DD format.'
        });
      });
    });

    it('should require an id of a birthday that exits in the store', () => {
      expect(
        replace('234', createBirthday('Zeus', '2009-02-02'))
      ).toEqual({ error: 'An unknown ID was provided.' });
    });
  });
});
