import * as birthdayRepository from '$lib/server/birthdayRepository.js';
import { createBirthday } from '$factories/birthday.js';
import {
  GET,
  POST
} from '$routes/api/birthdays/+server.js';
import { createRequest } from '$factories/request.js';

const bodyOfResponse = (response) => response.json();

describe('GET', () => {
  it('should return all the birthdays from the store', async () => {
    birthdayRepository.addNew(
      createBirthday('Hercules', '2010-04-05')
    );
    birthdayRepository.addNew(
      createBirthday('Ares', '2008-03-02')
    );

    const { birthdays } = await bodyOfResponse(GET());
    expect(birthdays).toEqual([
      expect.objectContaining(
        createBirthday('Hercules', '2010-04-05')
      ),
      expect.objectContaining(
        createBirthday('Ares', '2008-03-02')
      )
    ]);
  });
});

describe('POST', () => {
  beforeEach(birthdayRepository.clear);

  it('should save the birthday in the store', async () => {
    await POST({
      request: createRequest(
        createBirthday('Hercules', '2009-03-01')
      )
    });
    expect(birthdayRepository.getAll()).toHaveLength(1);
    expect(birthdayRepository.getAll()[0]).toContain(
      createBirthday('Hercules', '2009-03-01')
    );
  });

  it('should return a json response with the data', async () => {
    const response = await POST({
      request: createRequest(
        createBirthday('Hercules', '2009-03-01')
      )
    });
    expect(await bodyOfResponse(response)).toContain(
      createBirthday('Hercules', '2009-03-01')
    );
  });

  it('should throw an error if the data is invalid', async () => {
    // vitest will fail the test if the call does not raise an error
    expect.hasAssertions();
    try {
      await POST({
        request: createRequest(
          createBirthday('Hercules', '')
        )
      });
    } catch (e) {
      expect(e.status).toEqual(422);
      expect(e.body).toEqual({
        message:
          'Please provide a date of birth in the YYYY-MM-DD format.'
      });
    }
  });
});
