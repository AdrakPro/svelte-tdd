import * as birthdayRepository from '$lib/server/birthdayRepository.js';
import { createBirthday } from '$factories/birthday.js';
import { createRequest } from '$factories/request.js';
import { PUT } from '$routes/api/birthdays/[id]/+server.js';

describe('PUT', () => {
  beforeEach(() => {
    birthdayRepository.clear();
    birthdayRepository.addNew(
      createBirthday('Hercules', '2009-03-01')
    );
  });

  const storedId = () => birthdayRepository.getAll()[0].id;
  const bodyOfResponse = (response) => response.json();

  it('should update the birthday in the store', async () => {
    await PUT({
      request: createRequest(
        createBirthday('Hercules', '1999-03-01')
      ),
      params: { id: storedId() }
    });
    expect(birthdayRepository.getAll()).toHaveLength(1);
    expect(birthdayRepository.getAll()[0]).toContain(
      createBirthday('Hercules', '1999-03-01')
    );
  });

  it('should return a json response with the data', async () => {
    const response = await PUT({
      request: createRequest(
        createBirthday('Hercules', '1999-03-01')
      ),
      params: { id: storedId() }
    });
    expect(await bodyOfResponse(response)).toContain(
      createBirthday('Hercules', '1999-03-01', {
        id: storedId()
      })
    );
  });

  it('should throw an error if the data is invalid', async () => {
    expect.hasAssertions();
    try {
      await PUT({
        request: createRequest(
          createBirthday('Hercules', '')
        ),
        params: { id: storedId() }
      });
    } catch (error) {
      expect(error.status).toEqual(422);
      expect(error.body).toEqual({
        message:
          'Please provide a date of birth in the YYYY-MM-DD format.'
      });
    }
  });
});
