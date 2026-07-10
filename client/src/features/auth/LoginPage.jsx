import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Building2, User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, PasswordInput, Checkbox } from '../../components/shared';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid corporate email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * LoginPage.jsx
 * Phase C3.1 — Stitch UI Implementation (Login • Authentication)
 * 
 * Replaces legacy Tailwind presentation with pixel-perfect Stitch Enterprise Design System.
 * 100% preserves business logic, JWT handling, Protected Route redirect, hook form validation, and toast feedback.
 * Uses exclusively shared UI components (Button, Input, PasswordInput, Checkbox).
 */
const LoginPage = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // If auth has finished initializing and user is already logged in, redirect away from /login
  if (!loading && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data);
      // login should return user data on success; otherwise, read server message
      if (user) {
        toast.success('Successfully authenticated');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } catch (error) {
      // Prefer structured error message from server
      const serverMsg = error?.response?.data?.message || error?.message;
      toast.error(serverMsg || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSsoClick = (provider) => {
    toast.error(`${provider} Single Sign-On is managed by your organization identity provider.`);
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
              "Streamlining global operations with unyielding precision and absolute security. Experience the standard in workforce management."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 flex items-center justify-center">
                <User size={20} className="text-[#434655] dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#191b23] dark:text-white leading-tight">System Administrator</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Global Infrastructure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right/Center: Login Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 md:p-10 lg:p-12 bg-[#faf8ff] dark:bg-[#0a0a0a] relative z-10 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#191b23] dark:text-white tracking-tight mb-1">Welcome Back</h1>
            <p className="text-sm text-[#434655] dark:text-slate-400">Sign in to your enterprise portal to continue.</p>
          </div>

          {/* SSO Options */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleSsoClick('Google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#111111] text-[#191b23] dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSsoClick('Microsoft')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#111111] text-[#191b23] dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              <svg className="w-4 h-4" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-slate-800"></div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Or sign in with email</span>
            <div className="flex-1 h-px bg-[#e2e8f0] dark:bg-slate-800"></div>
          </div>

          {/* Credentials Form (Exclusively consuming Shared Components) */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Work Email"
              type="email"
              placeholder="name@company.com"
              required
              leadingIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Remember me"
                {...register('rememberMe')}
              />
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#2563eb] dark:text-blue-400 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 h-11 text-sm font-semibold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <a href="#support" onClick={(e) => { e.preventDefault(); toast('Please contact your IT administrator to provision an enterprise account.', { icon: 'ℹ️' }); }} className="font-semibold text-[#2563eb] dark:text-blue-400 hover:underline">
                Contact IT Support
              </a>
            </p>
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

export default LoginPage;
