import React from 'react';

/** First Tab stop on every page. Both layouts give their main area id="main". */
export default function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('main').focus();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:font-bold focus:rounded focus:shadow"
    >
      Skip to main content
    </a>
  );
}
