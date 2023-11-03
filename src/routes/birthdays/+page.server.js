import { fail } from '@sveltejs/kit';
import {
  addNew,
  getAll
} from '$lib/server/birthdayRepository.js';

addNew({ name: 'Hercules', dob: '1994-02-02' });
addNew({ name: 'Athena', dob: '1989-01-01' });

/** @type {import('./$types').PageLoad} */
export const load = () => ({
  birthdays: getAll()
});

// move to another file and test it
const empty = (value) =>
  value === undefined ||
  value === null ||
  value.trim() === '';

const invalidDob = (dob) => isNaN(Date.parse(dob));

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const dob = data.get('dob');

    if (empty(name)) {
      return fail(422, {
        error: 'Please provide a name.',
        dob
      });
    }

    if (invalidDob(dob)) {
      return fail(422, {
        error:
          'Please provide a date of birth in the YYYY-MM-DD format.',
        name,
        dob
      });
    }

    addNew({
      name,
      dob
    });
  }
};
