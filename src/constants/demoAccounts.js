/** Accounts the backend creates when DEMO_DATA=true. Shown only in development. */
export const DEMO_ACCOUNTS = import.meta.env.DEV
  ? [
      { role: 'citizen', label: 'Citizen', email: 'citizen@demo.example' },
      { role: 'admin', label: 'Govt Admin', email: 'admin@demo.example' },
      { role: 'university', label: 'University', email: 'university@demo.example' },
      { role: 'industry', label: 'Industry CSR', email: 'industry@demo.example' },
    ]
  : [];

export const DEMO_PASSWORD = import.meta.env.DEV ? 'Password123' : '';
