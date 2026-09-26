import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="max-w-md mx-auto py-8">
      <Card
        header={
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-slate-800 text-sm">
              Citizen & Stakeholder Registration
            </span>
            <Badge status="validated" size="sm">
              Phase F2 Preview
            </Badge>
          </div>
        }
      >
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Register as a Citizen to report local issues, or register under an accredited University or Industry organization. Multi-step onboarding coming in <strong className="text-primary">Phase F2</strong>.
          </p>
          <div className="pt-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Already registered? Sign In &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
