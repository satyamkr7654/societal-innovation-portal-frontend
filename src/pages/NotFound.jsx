import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <Card>
          <div className="space-y-5 py-6">
            <div className="text-6xl font-heading font-black text-slate-300">404</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Page Not Found
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                The requested URL does not exist or may have been relocated in the
                Societal Innovation Portal directory.
              </p>
            </div>
            <div className="pt-2">
              <Button to="/" variant="primary" size="md">
                &larr; Return to Home Portal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
