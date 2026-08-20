'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Gavel,
  Car,
  Sparkles,
  Globe,
  MessageSquare,
  Users,
  Calendar,
  FileCheck2,
  FileText,
  DollarSign,
  BarChart3,
  Bot,
  Zap,
  Settings,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Executive & Sourcing',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Opportunities', href: '/opportunities', icon: Target, badge: 'AI' },
      { name: 'Auction Center', href: '/auctions', icon: Gavel },
    ],
  },
  {
    title: 'Inventory & Marketing',
    items: [
      { name: 'Inventory', href: '/inventory', icon: Car },
      { name: 'AI Listing Studio', href: '/listings', icon: Sparkles, badge: 'AI' },
      { name: 'Marketplace Hub', href: '/marketplaces', icon: Globe },
    ],
  },
  {
    title: 'Sales, CRM & Deals',
    items: [
      { name: 'Unified Inbox', href: '/messages', icon: MessageSquare, badge: '3' },
      { name: 'Leads / CRM', href: '/leads', icon: Users },
      { name: 'Appointments', href: '/appointments', icon: Calendar },
      { name: 'Deals & F&I', href: '/deals', icon: FileCheck2 },
    ],
  },
  {
    title: 'Financials & Intelligence',
    items: [
      { name: 'Expenses & Basis', href: '/expenses', icon: DollarSign },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Dealer AI Assistant', href: '/assistant', icon: Bot, badge: 'Agent' },
      { name: 'Documents', href: '/documents', icon: FileText },
    ],
  },
  {
    title: 'System & Config',
    items: [
      { name: 'Automations', href: '/automations', icon: Zap },
      { name: 'Settings & Integrations', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Apex Auto Gallery
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded font-mono">PRO</span>
            </div>
            <div className="text-[11px] text-slate-400">DealerOS v2.6</div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          item.badge === 'AI' || item.badge === 'Agent'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Storefront Link & User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <Link
          href="/storefront"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Storefront</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
        </Link>

        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs">
            MV
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">Marcus Vance</div>
            <div className="text-[10px] text-slate-400 truncate">General Manager (Owner)</div>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
