/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Civic Status Badge color utilities — must be safelisted because they are
    // used as dynamic string values (not full class names) in statusConfig.js
    'bg-status-submitted-bg', 'text-status-submitted-text', 'border-status-submitted-border',
    'bg-status-validated-bg', 'text-status-validated-text', 'border-status-validated-border',
    'bg-status-assigned-bg',  'text-status-assigned-text',  'border-status-assigned-border',
    'bg-status-progress-bg',  'text-status-progress-text',  'border-status-progress-border',
    'bg-status-solved-bg',    'text-status-solved-text',    'border-status-solved-border',
    'bg-status-rejected-bg',  'text-status-rejected-text',  'border-status-rejected-border',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f2744', // Deep Navy Blue (Formal, trustworthy govt tone)
          light: '#1d3557',
          dark: '#0a192f',
        },
        accent: {
          DEFAULT: '#d97706', // Saffron / Amber (Used sparingly for highlights & CTAs)
          light: '#f59e0b',
          dark: '#b45309',
        },
        // Civic Problem Lifecycle Status Badges (bg, text, border pairs)
        status: {
          submitted: {
            bg: '#f1f5f9',
            text: '#475569',
            border: '#cbd5e1',
          },
          validated: {
            bg: '#eff6ff',
            text: '#1d4ed8',
            border: '#bfdbfe',
          },
          assigned: {
            bg: '#faf5ff',
            text: '#7e22ce',
            border: '#e9d5ff',
          },
          progress: {
            bg: '#fffbeb',
            text: '#b45309',
            border: '#fde68a',
          },
          solved: {
            bg: '#ecfdf5',
            text: '#047857',
            border: '#a7f3d0',
          },
          rejected: {
            bg: '#fef2f2',
            text: '#b91c1c',
            border: '#fecaca',
          },
        },
      },
      borderRadius: {
        sm: '0.25rem',  // 4px - badges, small tags
        DEFAULT: '0.375rem', // 6px - buttons, inputs
        md: '0.5rem',    // 8px - small cards
        lg: '0.75rem',   // 12px - standard cards, dialogs
        xl: '1rem',      // 16px - prominent containers
        full: '9999px',  // rounded pills
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(15, 39, 68, 0.05)',
        md: '0 4px 6px -1px rgba(15, 39, 68, 0.08), 0 2px 4px -2px rgba(15, 39, 68, 0.05)',
        lg: '0 10px 15px -3px rgba(15, 39, 68, 0.1), 0 4px 6px -4px rgba(15, 39, 68, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(15, 39, 68, 0.12), 0 4px 8px -2px rgba(15, 39, 68, 0.06)',
      },
    },
  },
  plugins: [],
}
