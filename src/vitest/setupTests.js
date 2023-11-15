import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import { toBeUnprocessableEntity } from '$matchers/toBeUnprocessableEntity.js';

expect.extend(matchers);
expect.extend({ toBeUnprocessableEntity });
afterEach(cleanup);
