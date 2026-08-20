'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenAssistant: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export function Header({
  onOpenCommandPalette,
  onOpenAssistant,
  onOpenNotifications,
  unreadNotificationsCount = 3,
}: HeaderProps) {
  return (
    <header className="h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Quick Search & Command Palette Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search vehicles, VINs, leads, auctions, deals...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action Buttons & AI Trigger */}
      <div className="flex items-center gap-3">
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
          <span>Ask Dealer AI</span>
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
      </div>
    </header>
  );
}
