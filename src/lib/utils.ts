import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export function calculateMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  termMonths: number,
  downPayment: number = 0
): number {
  const financed = Math.max(0, principal - downPayment);
  if (financed <= 0 || termMonths <= 0) return 0;
  if (annualInterestRatePercent <= 0) return financed / termMonths;
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const payment =
    (financed * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return isNaN(payment) ? 0 : Math.round(payment);
}

export function calculateGrossProfit(salePrice: number, costBasis: number): number {
  return salePrice - costBasis;
}

export function calculateRoi(profit: number, costBasis: number): number {
  if (costBasis <= 0) return 0;
  return Number(((profit / costBasis) * 100).toFixed(1));
}

export function getStatusBadgeVariant(status: string): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const norm = status?.toUpperCase() || '';
  switch (norm) {
    case 'STRONG_BUY':
    case 'STRONG BUY':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Strong Buy' };
    case 'BUY':
      return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Buy' };
    case 'WATCH':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Watch' };
    case 'PASS':
    case 'LOST':
    case 'FAILED':
    case 'CANCELLED':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Pass / Cancelled' };
    case 'READY':
    case 'LIVE':
    case 'ACTIVE':
    case 'APPROVED':
    case 'FUNDED':
    case 'DELIVERED':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: norm.replace('_', ' ') };
    case 'LISTED':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Listed' };
    case 'RECONDITIONING':
    case 'IN_TRANSIT':
    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'CONTRACTED':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: norm.replace('_', ' ') };
    case 'SOLD':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Sold' };
    case 'WHOLESALE':
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Wholesale' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: norm.replace('_', ' ') || 'Draft' };
  }
}
