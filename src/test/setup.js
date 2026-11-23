import { webcrypto } from 'node:crypto';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

// jsdom has no crypto.subtle, which password hashing needs
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

beforeEach(() => localStorage.clear());
afterEach(cleanup);
