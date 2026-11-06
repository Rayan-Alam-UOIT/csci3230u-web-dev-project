// AI-assisted - see AI-USAGE.md #<1>

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest'   // Extends Vitest with Jest-DOM matchers

// Automatically clean up DOM trees after every test case
afterEach(() => {
    cleanup();
})