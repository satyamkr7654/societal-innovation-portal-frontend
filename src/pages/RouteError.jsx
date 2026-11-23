import React from 'react';
import Button from '../components/ui/Button';

/** Friendly replacement for React Router's raw error screen. */
export default function RouteError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div role="alert" className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-heading font-bold text-slate-900">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-600">
          This page could not be displayed. Please reload, or return to the home page.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
          <Button variant="outline" onClick={() => window.location.assign('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
