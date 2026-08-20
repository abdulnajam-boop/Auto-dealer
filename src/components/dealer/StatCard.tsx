import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-400',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-slate-800/80 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
