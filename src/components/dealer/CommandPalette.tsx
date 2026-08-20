'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Car,
  Target,
  Gavel,
  MessageSquare,
  Users,
  FileCheck2,
  Sparkles,
  Bot,
  Zap,
  Settings,
  DollarSign,
  BarChart3,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { name: 'Dashboard', category: 'Navigation', href: '/dashboard', icon: BarChart3 },
  { name: 'Analyze Vehicle Opportunity (AI)', category: 'Sourcing', href: '/opportunities', icon: Target },
  { name: 'Auction Workspace & Watchlist', category: 'Sourcing', href: '/auctions', icon: Gavel },
  { name: 'Inventory Management', category: 'Inventory', href: '/inventory', icon: Car },
  { name: 'AI Listing Studio & Copywriter', category: 'Marketing', href: '/listings', icon: Sparkles },
  { name: 'Marketplace Hub (Publish Everywhere)', category: 'Marketing', href: '/marketplaces', icon: Sparkles },
  { name: 'Unified Buyer Inbox', category: 'Sales', href: '/messages', icon: MessageSquare },
  { name: 'CRM & Lead Pipeline', category: 'Sales', href: '/leads', icon: Users },
  { name: 'F&I Deal Desk & Bill of Sale', category: 'Finance', href: '/deals', icon: FileCheck2 },
  { name: 'Expenses & Vehicle Cost Basis', category: 'Financials', href: '/expenses', icon: DollarSign },
  { name: 'Dealer AI Executive Assistant', category: 'AI Assistant', href: '/assistant', icon: Bot },
  { name: 'Automation Engine Rules', category: 'System', href: '/automations', icon: Zap },
  { name: 'Dealership Settings & Integrations', category: 'Settings', href: '/settings', icon: Settings },
  { name: 'View Public Customer Storefront', category: 'Public', href: '/storefront', icon: ArrowRight },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCommands = COMMANDS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Search Input */}
        <div className="relative border-b border-slate-800 px-4 py-3.5 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching actions or commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.name}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs hover:bg-emerald-500/15 hover:text-emerald-300 text-slate-300 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white group-hover:text-emerald-200">
                        {cmd.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{cmd.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with ⌘K / Ctrl+K</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
