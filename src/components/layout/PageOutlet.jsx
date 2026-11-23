import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Spinner from '../ui/Spinner';

/** Shows a spinner inside the layout while a page's code is downloaded. */
export default function PageOutlet() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-primary">
          <Spinner size="lg" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}
