import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useParams } from 'react-router-dom';
import { Building2, User, CheckCircle2 } from 'lucide-react';
import authService from './authService';
import { Button, PasswordInput } from '../../components/shared';

const resetSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * ResetPasswordPage.jsx
 * Phase C3.1 — Stitch UI Implementation (Reset Password)
 * 
 * Standardized to Stitch Enterprise Design System.
 * Consumes exclusively shared UI components (Button, PasswordInput).
 */
const ResetPasswordPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: "onChange"
  });

  const passwordValue = watch('newPassword', '');

  // Password strength logic
  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score, label: 'None', color: 'bg-slate-200 dark:bg-slate-800', width: 'w-0' };
    if (pass.length > 8) score += 25;
    if (pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/[0-9]/)) score += 25;
    if (pass.match(/[^A-Za-z0-9]/)) score += 25;
    
    if (score <= 25) return { score, label: 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (score <= 50) return { score, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 75) return { score, label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { score, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = calculateStrength(passwordValue);

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Invalid or missing reset token.');
      return;
    }
    setIsLoading(true);
    setServerError('');
    try {
      await authService.resetPassword(token, { newPassword: data.newPassword });
      setIsSuccess(true);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Failed to reset password. The link might be expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] dark:bg-[#0a0a0a] text-[#191b23] dark:text-white min-h-screen flex flex-col md:flex-row antialiased font-sans overflow-hidden select-none">
      
      {/* Left/Top: Branding & Pattern (Stitch Auto Layout Match) */}
      <div className="relative flex-1 md:flex-none md:w-1/2 flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 bg-white dark:bg-[#111111] border-b md:border-b-0 md:border-r border-[#e2e8f0] dark:border-slate-800 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-sm">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#2563eb] dark:text-blue-400 tracking-tighter">EWMP</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#434655] dark:text-slate-400 mt-2">Enterprise Workforce Management Platform</p>
        </div>

        {/* Testimonial Panel (Desktop Only) */}
        <div className="hidden md:block z-10 mt-auto">
          <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border border-[#e2e8f0] dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-[#434655] dark:text-slate-300 mb-4 leading-relaxed italic font-medium">
              "Cryptographic key rotation and zero-knowledge credentials protect organizational integrity at every architectural layer."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 flex items-center justify-center">
                <User size={20} className="text-[#434655] dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#191b23] dark:text-white leading-tight">Security & Auth Hub</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Identity Governance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right/Center: Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 md:p-10 lg:p-12 bg-[#faf8ff] dark:bg-[#0a0a0a] relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#191b23] dark:text-white tracking-tight mb-1">Create New Password</h1>
            <p className="text-sm text-[#434655] dark:text-slate-400">Please enter your new strong enterprise password below.</p>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 sm:p-8 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-4 border border-emerald-200 dark:border-emerald-800/60">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-[#191b23] dark:text-white">Password Reset Successfully</h3>
                <p className="mt-2 text-xs text-[#434655] dark:text-slate-400 leading-relaxed">
                  Your enterprise password has been securely updated. You can now access your workspace using your new credentials.
                </p>
                <div className="mt-6">
                  <Link to="/login" className="block w-full">
                    <Button variant="primary" className="w-full py-2.5">
                      Proceed to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {serverError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{serverError}</span>
                  </div>
                )}

                <div>
                  <PasswordInput
                    label="New Password"
                    placeholder="••••••••"
                    required
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                  />
                  
                  {/* Password Strength Indicator */}
                  <div className="mt-2.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Strength: <span className="text-[#191b23] dark:text-white">{strength.label}</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
                    </div>
                  </div>
                </div>

                <PasswordInput
                  label="Confirm Password"
                  placeholder="••••••••"
                  required
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 h-11 text-sm font-semibold shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating Password...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-auto pt-8 w-full flex justify-center md:justify-end text-[11px] font-medium text-slate-400 dark:text-slate-500 gap-4">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#191b23] dark:hover:text-white transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#191b23] dark:hover:text-white transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#help" onClick={(e) => e.preventDefault()} className="hover:text-[#191b23] dark:hover:text-white transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
