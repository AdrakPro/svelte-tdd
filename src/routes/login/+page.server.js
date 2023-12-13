import { authProviders } from '../../authProviders.js';

export const load = async () => ({
  providers: Object.keys(authProviders)
});
