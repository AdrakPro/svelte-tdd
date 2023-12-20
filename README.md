
# Svelte-TDD

> Sveltekit birthday reminder using TDD


## Disclaimer

The goal of the project is to learn writing tests and understanding concepts like TDD, AAA, mocking, custom matchers and side-by-side implementation with general best practices.

Notes: [NOTES.md](NOTES.md) :exclamation:

This repository contains:
- 85 unit tests (vitest)
- 8 e2e tests (playwright)
- 1 cucumber test

Most of the code is from the book [Svelte with Test-Driven Development by Daniel Irvine](https://www.amazon.com/Svelte-Test-Driven-Development-Playwright-Cucumber-js/dp/1837638330).
## Environment Variables

In order to access GitHub auth you need to provide:

- `GITHUB_ID`
- `GITHUB_SECRET`

You can also log in with credentials, username is `api`.
## Run Locally

Clone the project

```bash
  git clone https://github.com/AdrakPro/svelte-tdd.git
```

Go to the project directory

```bash
  cd svelte-tdd
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Run tests (unit and e2e)

```bash
  npm run test
```

## Feedback

If you have any feedback, please reach out to me adam.makarewicz14@gmail.com

