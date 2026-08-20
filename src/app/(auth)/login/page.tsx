'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Building2 } from '@/components/icons';

const DEMO_PRESETS = [
  {
    label: 'Apex Owner',
    email: 'marcus@apexautogallery.com',
    role: 'OWNER',
    org: 'Apex Auto Gallery',
    color: 'emerald',
  },
  {
    label: 'Apex Sales',
    email: 'sarah@apexautogallery.com',
    role: 'SALES',
    org: 'Apex Auto Gallery',
    color: 'blue',
  },
  {
    label: 'Apex Inventory',
    email: 'carlos@apexautogallery.com',
    role: 'INVENTORY',
    org: 'Apex Auto Gallery',
    color: 'amber',
  },
  {
    label: 'Apex Finance',
    email: 'david@apexautogallery.com',
    role: 'FINANCE',
    org: 'Apex Auto Gallery',
    color: 'purple',
  },
  {
    label: 'Metro Imports Owner (2nd Tenant)',
    email: 'elena@metrocityimports.com',
    role: 'OWNER',
    org: 'Metro City Imports',
    color: 'cyan',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('marcus@apexautogallery.com');
  const [password, setPassword] = useState('dealer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login -> Redirect
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Unable to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('dealer123');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to DealerOS</h1>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your dealership workspace
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Work Email</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dealership.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Password</span>
              <span className="text-[11px] text-slate-400">Default: dealer123</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Account Switcher */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fast Role & Multi-Tenant Switcher</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_PRESETS.map((preset) => {
              const isSelected = email === preset.email;
              return (
                <button
                  key={preset.email}
                  type="button"
                  onClick={() => handlePresetSelect(preset.email)}
                  className={`text-left p-2 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>{preset.label}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {preset.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5" />
                    <span>{preset.org}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Onboarding Link */}
      <div className="text-center text-xs text-slate-400">
        Registering a new dealership?{' '}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">
          Create Dealership Account
        </Link>
      </div>
    </div>
  );
}
