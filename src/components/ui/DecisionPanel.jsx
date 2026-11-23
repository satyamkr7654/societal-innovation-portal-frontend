import React from 'react';
import Card from './Card';

/** A titled card for an action, with room for its error. */
export default function DecisionPanel({ title, error, children }) {
  return (
    <Card
      header={<h2 className="font-heading font-bold text-sm text-slate-900">{title}</h2>}
    >
      <div className="space-y-4">
        {children}
        {error && (
          <p role="alert" className="text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}
