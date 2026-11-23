import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '../../hooks/useAuth';
import { getRegisterSchema } from '../../schemas/authSchemas';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import Badge from '../../components/ui/Badge';

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [formError, setFormError] = useState('');
  const { user, register: createAccount } = useAuth();
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
    setFormError('');
    reset();
  };

  const onSubmit = async (data) => {
    setFormError('');
    try {
      const account = await createAccount({
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole,
        phone: data.phone,
        organizationName: data.institutionName || data.companyName,
      });
      navigate('/login', {
        state: { registeredEmail: account.email, needsApproval: !account.approved },
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto">
      {/* Split-Screen Civic Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Panel: what each role gains */}
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
                  Societal Innovation Portal
                </div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-sans">
                  Academic prototype
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
                Take part in solving local problems in Jharkhand.
              </p>
            </div>

            {/* Stakeholder Highlights */}
            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">👤 For Citizens:</span>
                <p className="text-[11px] text-slate-300">
                  Report a problem with a photo and location, and follow each step.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">🎓 For Universities:</span>
                <p className="text-[11px] text-slate-300">
                  Receive verified problems, propose solutions and find industry support.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary-light/30 border border-primary-light/50 space-y-1">
                <span className="font-bold text-accent-light">🏭 For Industries:</span>
                <p className="text-[11px] text-slate-300">
                  Discover approved proposals and offer funds, equipment or mentorship.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <span>SIH 2026 • SIH26043</span>
            <span>Not an official website</span>
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

            {formError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
              >
                {formError}
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
                    aria-pressed={selectedRole === role.id}
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
                * Admin accounts cannot be self-registered.
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
                  helperText="Used only to contact you about your reports"
                  {...register('phone')}
                  error={errors.phone}
                />
              )}

              {selectedRole === 'university' && (
                <FormInput
                  label="Institution / University"
                  placeholder="e.g. Palash Institute of Technology"
                  required
                  helperText="Accredited institution name"
                  {...register('institutionName')}
                  error={errors.institutionName}
                />
              )}

              {selectedRole === 'industry' && (
                <FormInput
                  label="Company / CSR Foundation"
                  placeholder="e.g. Shikhar Steel CSR"
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
