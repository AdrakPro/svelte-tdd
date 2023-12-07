/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  env: {
    PATH: process.env.PATH,
    VITE_ALLOW_CREDENTIALS: true
  }
};

export default config;
