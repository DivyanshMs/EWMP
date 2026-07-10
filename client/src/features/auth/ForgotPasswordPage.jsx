import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Building2, User, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import authService from './authService';
import { Button, Input } from '../../components/shared';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid corporate email address'),
});

/**
 * ForgotPasswordPage.jsx
 * Phase C3.1 — Stitch UI Implementation (Forgot Password)
 * 
 * Standardized to Stitch Enterprise Design System.
 * Consumes exclusively shared UI components (Button, Input).
 */
const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await authService.forgotPassword(data);
      setIsSuccess(true);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Failed to process request. Please try again.'
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
              "Enterprise security governance requires zero-trust verification and instantaneous recovery protocols across all global tenant endpoints."
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#191b23] dark:text-white tracking-tight mb-1">Reset Password</h1>
            <p className="text-sm text-[#434655] dark:text-slate-400">Enter your work email and we'll send you a recovery link.</p>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 sm:p-8 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-4 border border-emerald-200 dark:border-emerald-800/60">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-[#191b23] dark:text-white">Check your email</h3>
                <p className="mt-2 text-xs text-[#434655] dark:text-slate-400 leading-relaxed">
                  We've sent a password reset link to your corporate email address. Please check your inbox and spam folder.
                </p>
                <div className="mt-6">
                  <Link to="/login" className="block w-full">
                    <Button variant="primary" className="w-full py-2.5">
                      Return to Sign In
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

                <Input
                  label="Work Email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  leadingIcon={<Mail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2.5 h-11 text-sm font-semibold shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </Button>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center text-xs font-semibold text-[#434655] hover:text-[#191b23] dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} className="mr-1.5" />
                    Back to Sign In
                  </Link>
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

export default ForgotPasswordPage;
