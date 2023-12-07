import * as jestMatchers from '@testing-library/jest-dom/matchers';
import * as mockMatchers from 'svelte-component-double/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import { toBeUnprocessableEntity } from '$matchers/toBeUnprocessableEntity.js';

expect.extend(jestMatchers);
expect.extend(mockMatchers);
expect.extend({ toBeUnprocessableEntity });
afterEach(cleanup);

import { componentDouble } from 'svelte-component-double';

globalThis.componentDouble = componentDouble;
