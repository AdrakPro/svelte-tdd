export const fetchResponseOk = (response = {}) => ({
  status: 'ok',
  json: () => Promise.resolve(response)
});

export const fetchResponseError = (message) => ({
  status: 'error',
  json: () => Promise.resolve({ message })
});
