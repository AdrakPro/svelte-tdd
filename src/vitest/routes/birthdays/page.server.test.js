import {
  actions,
  load
} from '$routes/birthdays/+page.server.js';
import { vi } from 'vitest';
import { createFormDataRequest } from '$factories/formDataRequest.js';
import { createBirthday } from '$factories/birthday.js';
import {
  fetchResponseError,
  fetchResponseOk
} from '$factories/fetch.js';

describe('/birthdays - load', () => {
  it('should call fetch with /api/birthdays', async () => {
    const fetch = vi.fn();
    fetch.mockResolvedValue(fetchResponseOk());
    await load({ fetch });
    expect(fetch).toBeCalledWith('/api/birthdays');
  });

  it('should return the response body', async () => {
    const birthdays = [
      createBirthday('Hercules', '1994-02-02'),
      createBirthday('Athena', '1989-01-01')
    ];
    const fetch = vi.fn();
    fetch.mockResolvedValue(fetchResponseOk({ birthdays }));
    const result = await load({ fetch });
    expect(result).toEqual({ birthdays });
  });
});

describe('/birthdays - default action', () => {
  const fetch = vi.fn();

  const performFormAction = (formData) =>
    actions.default({
      request: createFormDataRequest(formData),
      fetch
    });

  beforeEach(() => {
    fetch.mockResolvedValue(fetchResponseOk());
  });

  describe('when adding a new birthday', () => {
    it('should request data from POST /api/birthdays', async () => {
      await performFormAction(
        createBirthday('Zeus', '2009-02-02')
      );

      expect(fetch).toBeCalledWith(
        '/api/birthdays',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should send the birthday as the request body', async () => {
      await performFormAction(
        createBirthday('Zeus', '2009-02-02')
      );

      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            name: 'Zeus',
            dob: '2009-02-02'
          })
        })
      );
    });

    it('should return a 422 if the POST request returns an error', async () => {
      fetch.mockResolvedValue(
        fetchResponseError('error message')
      );
      const result = await performFormAction(
        createBirthday('Zeus', '2009-02-02')
      );
      expect(result).toBeUnprocessableEntity({
        error: 'error message',
        name: 'Zeus',
        dob: '2009-02-02'
      });
    });
  });

  describe('when replacing an existing birthday', () => {
    it('should request data from PUT /api/birthday/{id}', async () => {
      await performFormAction(
        createBirthday('Zeus', '2009-02-02', {
          id: '123'
        })
      );

      expect(fetch).toBeCalledWith(
        '/api/birthday/123',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should send the birthday as the request body', async () => {
      await performFormAction(
        createBirthday('Zeus', '2009-02-02', {
          id: '123'
        })
      );

      expect(fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({
            name: 'Zeus',
            dob: '2009-02-02'
          })
        })
      );
    });

    it('should return a 422 if the POST request returns an error', async () => {
      fetch.mockResolvedValue(
        fetchResponseError('error message')
      );
      const result = await performFormAction(
        createBirthday('Zeus', '2009-02-02', {
          id: '123'
        })
      );
      expect(result).toBeUnprocessableEntity({
        error: 'error message',
        name: 'Zeus',
        dob: '2009-02-02',
        id: '123'
      });
    });
  });
});
