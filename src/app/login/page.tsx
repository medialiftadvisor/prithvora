'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Lock, AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import Link from 'next/link';

import { registerCustomer } from '@/app/actions';

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to callback URL
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Validation
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }

        // Register
        const res = await registerCustomer({ name, email, password });
        if (!res.success) {
          setError(res.error || 'Registration failed.');
          setLoading(false);
          return;
        }
        
        setSuccess('Account created successfully! Signing you in...');
      }

      // Sign In (both standard sign-in and post-register sign-in)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid credentials. Check your email or password.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl relative z-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center border border-primary/20">
              <img src="/logo.png" alt="PRITHVORA Logo" className="object-contain w-8 h-8" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-league font-bold text-lg text-spruce leading-none tracking-wider group-hover:text-primary transition-colors">
                PRITHVORA
              </span>
              <span className="text-[8px] font-bold text-accent tracking-widest uppercase mt-0.5 leading-none">
                AGRIVERSE
              </span>
            </div>
          </Link>
        </div>
        <h2 className="text-2xl sm:text-3xl font-league font-black text-spruce tracking-tight">
          {isRegistering ? 'Create Your Account' : 'Welcome to the Agriverse'}
        </h2>
        <p className="text-xs text-gray-500 font-inter max-w-xs mx-auto">
          {isRegistering 
            ? 'Sign up to track fresh cold-chain deliveries, save multiple addresses, and view grower reports.' 
            : 'Access your order history, stakeholder applications, or regional franchise metrics.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => {
            setIsRegistering(false);
            setError('');
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center cursor-pointer transition-colors ${
            !isRegistering ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-spruce'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setIsRegistering(true);
            setError('');
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center cursor-pointer transition-colors ${
            isRegistering ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-spruce'
          }`}
        >
          Register
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-bold">Error Occurred</span>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex gap-3 text-green-800 text-xs">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-green-600 mt-0.5" />
          <div>
            <span className="font-bold">Success</span>
            <p className="mt-0.5">{success}</p>
          </div>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
        <div className="space-y-3">
          
          {/* Full Name (Registration only) */}
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Rao Saheb"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-offwhite/50 text-spruce"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-offwhite/50 text-spruce"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-offwhite/50 text-spruce"
              />
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-offwhite/50 text-spruce"
                />
              </div>
            </div>
          )}

        </div>

        {/* Submit Trigger */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-league font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isRegistering ? 'Create Account' : 'Sign In to Account'}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Helper Box */}
      <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="w-4 h-4" />
          <h4 className="font-league font-bold text-sm tracking-wider uppercase text-[10px]">Demo credentials</h4>
        </div>
        <p className="text-[9px] text-gray-500 leading-relaxed font-medium">
          Feel free to register a new account, or log in with our demo users instantly:
        </p>
        <ul className="space-y-2 text-[10px] text-gray-500 font-medium border-t border-gray-100 pt-2">
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span>👤 <strong>Admin:</strong></span>
            <span className="font-mono text-primary font-bold">admin@prithvora.com</span>
          </li>
          <li className="flex justify-between border-b border-gray-100 pb-1">
            <span>👤 <strong>Standard Customer:</strong></span>
            <span className="font-mono text-primary font-bold">user@prithvora.com</span>
          </li>
          <li className="flex justify-between">
            <span>🔑 <strong>Password:</strong></span>
            <span className="font-mono text-primary font-bold">Any password you choose</span>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-offwhite px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background radial gradients for luxury aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center justify-center py-20 space-y-4 relative z-10">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Login Portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
