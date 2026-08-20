'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Bot,
  Plus,
  Car,
  DollarSign,
  TrendingUp,
  ChevronDown,
  Building2,
  LogOut,
  User,
  ShieldCheck,
  Check,
} from '@/components/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenAssistant: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface OrgMembership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
}

export function Header({
  onOpenCommandPalette,
  onOpenAssistant,
  onOpenNotifications,
  unreadNotificationsCount = 3,
}: HeaderProps) {
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentOrg, setCurrentOrg] = useState<{ id: string; name: string; slug: string; role: string } | null>(null);
  const [allOrgs, setAllOrgs] = useState<OrgMembership[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch active session info
    async function loadAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
            setCurrentOrg(data.currentOrganization);
            setAllOrgs(data.organizations || []);
          }
        }
      } catch (err) {
        console.error('Failed to load auth session:', err);
      }
    }
    loadAuth();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchOrg = async (orgId: string) => {
    try {
      const res = await fetch('/api/auth/switch-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId }),
      });
      if (res.ok) {
        setUserDropdownOpen(false);
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch organization:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DO';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Quick Search & Command Palette Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search vehicles, VINs, leads, auctions, deals...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Buttons, Dealership Indicator & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sourcing Quick Action */}
        <Link
          href="/opportunities"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Analyze Opportunity</span>
        </Link>

        {/* AI Executive Assistant Button */}
        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
        >
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Ask Dealer AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Profile & Org Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xs font-bold text-slate-950 font-mono shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-200 leading-tight">
                {user?.name || 'Marcus Vance'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                {currentOrg?.role || 'OWNER'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-from-top-2 duration-150">
              {/* User info banner */}
              <div className="px-3 py-2.5 border-b border-slate-800">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Marcus Vance'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'marcus@apexautogallery.com'}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                    {currentOrg?.role || 'OWNER'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {currentOrg?.name || 'Apex Auto Gallery'}
                  </span>
                </div>
              </div>

              {/* Organization Switcher Section */}
              {allOrgs.length > 1 && (
                <div className="py-2 border-b border-slate-800">
                  <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Switch Dealership</span>
                  </div>
                  <div className="space-y-0.5">
                    {allOrgs.map((org) => {
                      const orgId = org.organizationId;
                      const orgName = org.organizationName;
                      const isCurrent = orgId === currentOrg?.id;
                      return (
                        <button
                          key={orgId}
                          onClick={() => handleSwitchOrg(orgId)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="truncate">
                            <div>{orgName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{org.role}</div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Links */}
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dealership Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center gap-2 transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
