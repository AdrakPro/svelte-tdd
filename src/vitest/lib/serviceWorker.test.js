import { vi } from 'vitest';
import {
  addFilesToCache,
  deleteOldCaches,
  fetchWithCacheOnError
} from '$lib/serviceWorker.js';

global.caches = {
  open: () => {},
  keys: () => {},
  delete: () => {}
};

describe('addFilesToCache', () => {
  let cache;

  beforeEach(() => {
    cache = {
      addAll: vi.fn()
    };
    vi.spyOn(global.caches, 'open');
    caches.open.mockResolvedValue(cache);
  });

  it('should open the cache with the given id', async () => {
    await addFilesToCache('cache-id', []);
    expect(global.caches.open).toBeCalledWith('cache-id');
  });

  it('should add all provided assets to the cache', async () => {
    const assets = [1, 2, 3];
    await addFilesToCache('cache-id', assets);
    expect(cache.addAll).toBeCalledWith(assets);
  });
});

describe('deleteOldCaches', () => {
  beforeEach(() => {
    vi.spyOn(global.caches, 'keys');
    vi.spyOn(global.caches, 'delete');
  });

  it('should call keys to retrieve all keys', async () => {
    caches.keys.mockResolvedValue([]);
    await deleteOldCaches('cache-id');
    expect(caches.keys).toBeCalled();
  });

  it('should delete all caches with the provided keys', async () => {
    caches.keys.mockResolvedValue([
      'cache-one',
      'cache-two'
    ]);
    await deleteOldCaches('cache-id');
    expect(caches.delete).toBeCalledWith('cache-one');
    expect(caches.delete).toBeCalledWith('cache-two');
  });

  it('should not delete the cache with the provided id', async () => {
    caches.keys.mockResolvedValue(['cache-id']);
    await deleteOldCaches('cache-id');
    expect(caches.delete).not.toBeCalledWith('cache-id');
  });
});

describe('fetchWithCacheOnError', () => {
  const successResponse = {
    status: 200,
    clone: () => 'cloned response'
  };
  let cache;

  beforeEach(() => {
    cache = {
      put: vi.fn(),
      match: vi.fn()
    };
    vi.spyOn(global.caches, 'open');
    caches.open.mockResolvedValue(cache);
    vi.spyOn(global, 'fetch');
    fetch.mockResolvedValue(successResponse);
  });

  const request = 'request';

  it('should open the cache with the given id', async () => {
    await fetchWithCacheOnError('cache-id', request);
    expect(global.caches.open).toBeCalledWith('cache-id');
  });

  it('should call fetch with the request', async () => {
    await fetchWithCacheOnError('cache-id', request);
    expect(global.fetch).toBeCalledWith(request);
  });

  it('should cache the response after cloning', async () => {
    await fetchWithCacheOnError('cache-id', request);
    expect(cache.put).toBeCalledWith(
      request,
      'cloned response'
    );
  });

  it('should return the response', async () => {
    const result = await fetchWithCacheOnError(
      'cache-id',
      request
    );
    expect(result).toEqual(successResponse);
  });

  it('should not cache the response if the status code is not 200', async () => {
    fetch.mockResolvedValue({ status: 404 });
    await fetchWithCacheOnError('cache-id', request);
    expect(cache.put).not.toBeCalled();
  });

  describe('when fetch returns a network error', () => {
    let cachedResponse = 'cached-response';

    beforeEach(() => {
      fetch.mockRejectedValue({});
      cache.match.mockResolvedValue(cachedResponse);
    });

    it('should retrieve the cached value', async () => {
      await fetchWithCacheOnError('cache-id', request);
      expect(cache.match).toBeCalledWith(request);
    });

    it('should return the cached value', async () => {
      const result = await fetchWithCacheOnError(
        'cache-id',
        request
      );
      expect(result).toEqual(cachedResponse);
    });
  });
});
