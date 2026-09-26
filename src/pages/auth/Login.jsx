import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="max-w-md mx-auto py-8">
      <Card
        header={
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-slate-800 text-sm">
              Stakeholder Sign In
            </span>
            <Badge status="validated" size="sm">
              Phase F2 Preview
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Role-based login for Citizens, Government Officers, University Faculty, and Industry CSR Partners. Full form validation and JWT handling coming in <strong className="text-primary">Phase F2</strong>.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="outline" size="sm" className="w-full">
                Don't have an account? Register &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
