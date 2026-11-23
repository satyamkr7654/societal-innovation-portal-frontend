/** Accounts the backend creates when DEMO_DATA=true. Shown only in development. */
export const DEMO_ACCOUNTS = import.meta.env.DEV
  ? [
      { role: 'citizen', label: 'Citizen', email: 'citizen.ramesh@gmail.com' },
      { role: 'admin', label: 'Govt Admin', email: 'admin.dept@jharkhand.gov.in' },
      { role: 'university', label: 'University', email: 'faculty@bitmesra.ac.in' },
      { role: 'industry', label: 'Industry CSR', email: 'csr@tatasteel.com' },
    ]
  : [];

export const DEMO_PASSWORD = import.meta.env.DEV ? 'Password123' : '';
