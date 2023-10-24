import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

expect.extend(matchers);
afterEach(cleanup);
