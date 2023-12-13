import GitHubProvider from '@auth/core/providers/github';
import CredentialsProvider from '@auth/core/providers/credentials';

const GitHub = GitHubProvider({
  clientId: import.meta.env.GITHUB_ID,
  clientSecret: import.meta.env.GITHUB_SECRET
});

const credentials = CredentialsProvider({
  credentials: {
    username: { label: 'Username', type: 'text' }
  },
  async authorize({ username }) {
    if (username === 'api') return { id: '1', name: 'api' };
  }
});

export const authProviders = { GitHub, credentials };
