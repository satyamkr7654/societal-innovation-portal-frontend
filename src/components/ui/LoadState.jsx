import React from 'react';
import Button from './Button';
import Spinner from './Spinner';

/** Shown in place of a page's content while its data is loading or has failed to load. */
export default function LoadState({ error, onRetry }) {
  if (!error) {
    return (
      <div className="py-20 text-center text-primary">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div role="alert" className="py-20 text-center space-y-3">
      <p className="text-sm text-slate-700">{error.message}</p>
      <Button size="sm" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
