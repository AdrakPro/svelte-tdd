import GitHubProvider from '@auth/core/providers/github';
import CredentialsProvider from '@auth/core/providers/credentials';

const allowCredentials =
  import.meta.env.VITE_ALLOW_CREDENTIALS === 'true';

const GitHub = GitHubProvider({
  clientId: import.meta.env.GITHUB_ID,
  clientSecret: import.meta.env.GITHUB_SECRET
});

const credentials = CredentialsProvider({
  credentials: {
    username: { label: 'Username', type: 'text' }
  },
  async authorize({ username }, req) {
    if (username === 'api') return { id: '1', name: 'api' };
  }
});

const devAuthProviders = {
  GitHub,
  credentials
};

const prodAuthProviders = { GitHub };
export const authProviders = allowCredentials
  ? devAuthProviders
  : prodAuthProviders;
