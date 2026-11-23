import * as z from 'zod';

// Without this, Zod tests whether eval is allowed, which the Content-Security-Policy blocks
z.config({ jitless: true });

export { z };
