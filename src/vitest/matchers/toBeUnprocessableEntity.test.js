import { fail } from '@sveltejs/kit';
import { toBeUnprocessableEntity } from '$matchers/toBeUnprocessableEntity.js';

describe('toBeUnprocessableEntity', () => {
  beforeAll(() => {
    expect.extend({ toBeUnprocessableEntity });
  });

  it('should throw if the status is not 422', () => {
    const response = fail(500);
    expect(() =>
      expect(response).toBeUnprocessableEntity()
    ).toThrowError();
  });

  it('should not throw if the status is 422', () => {
    const response = fail(422);
    expect(() =>
      expect(response).toBeUnprocessableEntity()
    ).not.toThrowError();
  });

  it('should return a message that includes the actual error code', () => {
    const response = fail(500);
    expect(() =>
      expect(response).toBeUnprocessableEntity()
    ).toThrowError('Expected 422 status code but got 500');
  });

  it('should throw error if the provided object does not match', () => {
    const response = fail(422, { a: 'b' });
    expect(() =>
      expect(response).toBeUnprocessableEntity({
        c: 'd'
      })
    ).toThrowError();
  });

  it('should not throw error if the provided object does match', () => {
    const response = fail(422, { a: 'b' });
    expect(() =>
      expect(response).toBeUnprocessableEntity({
        a: 'b'
      })
    ).not.toThrowError();
  });

  it('should not throw error if the provide object is a partial match', () => {
    const response = fail(422, { a: 'b', c: 'd' });
    expect(() =>
      expect(response).toBeUnprocessableEntity({
        a: 'b'
      })
    ).not.toThrowError();
  });

  it('should return a message if the provided object does not match', () => {
    const response = fail(422, { a: 'b' });
    expect(() =>
      expect(response).toBeUnprocessableEntity({
        c: 'd'
      })
    ).toThrowError(/Response body was not equal/);
  });

  describe('not', () => {
    it('should return a message if the status is 422 with the same body', () => {
      const response = fail(422, { a: 'b' });
      expect(() =>
        expect(response).not.toBeUnprocessableEntity({
          a: 'b'
        })
      ).toThrowError(
        /Expected non-422 status code but got 422/
      );
    });

    it('should include with the received response body in the message', () => {
      const response = fail(422, { a: 'b' });
      expect(() =>
        expect(response).not.toBeUnprocessableEntity({
          a: 'b'
        })
      ).toThrowError(/"a": "b"/);
    });

    it('should return a negated message for a non-422 status with no body', () => {
      const response = fail(422);
      expect(() =>
        expect(response).not.toBeUnprocessableEntity()
      ).toThrowError(
        'Expected non-422 status code but got 422'
      );
    });
  });
});
