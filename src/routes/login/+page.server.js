import { authProviders } from '../../authProviders.js';

export const load = async ({ locals, request }) => ({
  providers: Object.keys(authProviders)
});
