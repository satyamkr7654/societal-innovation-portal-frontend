import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import Badge from '../../components/ui/Badge';

/**
 * Dynamic Zod Validation Schema Factory
 */
const getRegisterSchema = (role) => {
  const baseSchema = {
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please provide a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number (0-9)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  };

  if (role === 'citizen') {
    baseSchema.phone = z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number (starting with 6-9)');
  } else if (role === 'university') {
    baseSchema.institutionName = z
      .string()
      .min(3, 'Institution name must be at least 3 characters (e.g. BIT Mesra)');
  } else if (role === 'industry') {
    baseSchema.companyName = z
      .string()
      .min(2, 'Company/Organization name must be at least 2 characters (e.g. Tata Steel CSR)');
  }

  return z
    .object(baseSchema)
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
};

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const roleOptions = [
    { id: 'citizen', label: 'Citizen', icon: '👤', desc: 'Lodge local issues' },
    { id: 'university', label: 'University', icon: '🎓', desc: 'R&D proposals' },
    { id: 'industry', label: 'Industry', icon: '🏭', desc: 'CSR funding' },
  ];

  const currentSchema = getRegisterSchema(selectedRole);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onTouched',
  });

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setSuccessMessage('');
    reset();
  };

  const onSubmit = async (data) => {
    setSuccessMessage('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessMessage(
        `Account created for ${data.name} as ${selectedRole.toUpperCase()}! Redirecting to Sign In...`
      );

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch {
      // Swapped with Axios in Phase F8
    }
  };

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto">
      {/* Split-Screen Civic Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Panel: Official Government Identity & Enrollment Benefits */}
        <div className="lg:col-span-5 bg-primary text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-primary-light">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-light/40 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Header Badge */}
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
                Enrollment
              </span>
              <h1 className="text-2xl font-heading font-bold tracking-tight text-white leading-snug">
                Join the Civic Innovation Ecosystem
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Participate in localized community transformation under the supervision of state nodal authorities.
              </p>
            </div>

            {/* Stakeholder Highlights */}
            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">👤 For Citizens:</span>
                <p className="text-[11px] text-slate-300">
                  Track resolution progress with verified photos and geotagged GPS timestamps.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">🎓 For Universities:</span>
                <p className="text-[11px] text-slate-300">
                  Receive state-accredited problem assignments and direct industry CSR grants.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">🏭 For Industries:</span>
                <p className="text-[11px] text-slate-300">
                  Direct Section 135 CSR compliance with verifiable societal impact metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <span>SIH 2026 • SIH26043</span>
            <span>Ranchi, Jharkhand</span>
          </div>
        </div>

        {/* Right Panel: Form Area */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                  Create Account
                </h2>
                <Badge status="validated" size="sm">
                  Register
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Select your stakeholder category and provide registration details.
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* 1. Segmented Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Stakeholder Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`
                      flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer
                      ${
                        selectedRole === role.id
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }
                    `}
                  >
                    <span className="text-sm mb-0.5">{role.icon}</span>
                    <span className="text-[11px]">{role.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 italic">
                * Govt Admin accounts are provisioned directly by nodal authorities and cannot be self-registered.
              </p>
            </div>

            {/* 2. Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormInput
                  label="Full Name"
                  placeholder="e.g. Rajesh Kumar"
                  required
                  {...register('name')}
                  error={errors.name}
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="name@domain.com"
                  required
                  {...register('email')}
                  error={errors.email}
                />
              </div>

              {selectedRole === 'citizen' && (
                <FormInput
                  label="Phone Number"
                  type="tel"
                  placeholder="10-digit mobile (e.g. 9876543210)"
                  required
                  helperText="Required for OTP & problem status SMS alerts"
                  {...register('phone')}
                  error={errors.phone}
                />
              )}

              {selectedRole === 'university' && (
                <FormInput
                  label="Institution / University"
                  placeholder="e.g. BIT Mesra / NIT Jamshedpur"
                  required
                  helperText="Accredited institution name"
                  {...register('institutionName')}
                  error={errors.institutionName}
                />
              )}

              {selectedRole === 'industry' && (
                <FormInput
                  label="Company / CSR Foundation"
                  placeholder="e.g. Tata Steel Foundation"
                  required
                  helperText="CSR donor or industrial mentor entity"
                  {...register('companyName')}
                  error={errors.companyName}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Min 8 chars + 1 number"
                  required
                  {...register('password')}
                  error={errors.password}
                />

                <FormInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-type password"
                  required
                  {...register('confirmPassword')}
                  error={errors.confirmPassword}
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
                  Register as {selectedRole.toUpperCase()} &rarr;
                </Button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign In to Account &rarr;
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
