import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../constants/demoAccounts';
import { loginSchema } from '../../schemas/authSchemas';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import Badge from '../../components/ui/Badge';

export default function Login() {
  const [authError, setAuthError] = useState('');
  const location = useLocation();
  const { user, login } = useAuth();
  const registeredEmail = location.state?.registeredEmail;

  // If redirected by ProtectedRoute, capture the intended path
  const from = location.state?.from;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: registeredEmail || '', password: '' },
  });

  const handleQuickFill = (account) => {
    setValue('email', account.email, { shouldValidate: true });
    setValue('password', DEMO_PASSWORD, { shouldValidate: true });
    setAuthError('');
  };

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await login(data);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Covers a successful login as well as visiting this page while already signed in
  if (user) {
    const mayReturn =
      from &&
      (from.pathname.startsWith(`/${user.role}/`) || from.pathname === '/notifications');
    return <Navigate to={mayReturn ? from : `/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto">
      {/* Split-Screen Civic Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Panel: Official Government Branding & Stakeholder Information */}
        <div className="lg:col-span-5 bg-primary text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-primary-light">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-light/40 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Seal / Emblem */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-white font-heading font-black text-sm border border-primary/50 shadow-xs">
                JH
              </div>
              <div>
                <div className="font-heading font-bold text-sm tracking-tight text-white">
                  Government of Jharkhand
                </div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-sans">
                  Higher & Technical Education Dept.
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="inline-block px-2.5 py-0.5 bg-accent/20 text-accent-light text-[11px] font-bold rounded uppercase tracking-wider border border-accent/30">
                Single Sign-On
              </span>
              <h1 className="text-2xl font-heading font-bold tracking-tight text-white leading-snug">
                Societal Innovation Collaboration Portal
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Access your specialized dashboard to submit local grievances, evaluate
                technical proposals, or commit CSR development funds.
              </p>
            </div>

            {/* Civic Pillars Feature List */}
            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-accent-light text-xs shrink-0">
                  ✓
                </span>
                <span>Citizens lodge geo-tagged municipal issues</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-accent-light text-xs shrink-0">
                  ✓
                </span>
                <span>Universities build field-tested solutions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-accent-light text-xs shrink-0">
                  ✓
                </span>
                <span>Industries fund vetted community milestones</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Accreditation Tag */}
          <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <span>SIH 2026 • SIH26043</span>
            <span>Helpline: 1800-JH-CIVIC</span>
          </div>
        </div>

        {/* Right Panel: Clean Interactive Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                  Sign In to Portal
                </h2>
                <Badge status="validated" size="sm">
                  Official Access
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Enter your email and password.</p>
            </div>

            {/* Quick Demo Accounts Helper Bar */}
            {DEMO_ACCOUNTS.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Evaluation Accounts (1-Click Fill):
                  </span>
                  <span className="text-[10px] font-mono text-primary font-semibold">
                    SIH Demo
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className="px-2.5 py-1.5 bg-white hover:bg-primary/5 hover:border-primary/40 border border-slate-200 rounded text-left text-xs font-semibold text-slate-700 transition cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <span>{acc.label}</span>
                      <span className="text-[10px] text-primary">&rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Protected Route Notice */}
            {from && !authError && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Please sign in to access that protected portal area.</span>
              </div>
            )}

            {/* Error & Success Feedback Banners */}
            {authError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150"
              >
                <svg
                  className="w-4 h-4 text-red-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {registeredEmail && !authError && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
                <svg
                  className="w-4 h-4 text-emerald-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Account created. Please sign in.</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormInput
                label="Email Address"
                type="email"
                placeholder="name@domain.com"
                required
                {...register('email')}
                error={errors.email}
              />

              <div>
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  {...register('password')}
                  error={errors.password}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full justify-center"
                >
                  Sign In to Dashboard &rarr;
                </Button>
              </div>

              <div className="pt-3 text-center border-t border-slate-100 text-xs text-slate-500">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register as Citizen / Organization &rarr;
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
