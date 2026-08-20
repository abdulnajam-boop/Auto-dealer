import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import {
  DollarSign,
  Plus,
  Car,
  PieChart,
  TrendingDown,
  Receipt,
  ArrowRight,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const tenant = await getTenantContext();

  const expenses = await prisma.vehicleExpense.findMany({
    where: { organizationId: tenant.organizationId },
    include: { vehicle: true },
    orderBy: { date: 'desc' },
  });

  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categories = [
    'ACQUISITION',
    'AUCTION_FEE',
    'TRANSPORTATION',
    'MECHANICAL',
    'BODY_PAINT',
    'DETAILING',
    'PARTS',
    'INSPECTION',
    'ADVERTISING',
  ];

  const categoryTotals: Record<string, number> = {};
  for (const cat of categories) {
    categoryTotals[cat] = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Vehicle Expenses & Cost Accounting
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track acquisition costs, auction buy fees, reconditioning, and parts per unit.
          </p>
        </div>
      </div>

      {/* Category Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.slice(0, 5).map((cat) => (
          <div key={cat} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {cat.replace('_', ' ')}
            </span>
            <div className="text-base font-bold text-white font-mono">
              {formatCurrency(categoryTotals[cat] || 0)}
            </div>
          </div>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Itemized Expense Ledger</h2>
            <p className="text-xs text-slate-400">All recorded capital outlays and parts</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Total Outlay: {formatCurrency(totalExpenseSum)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2.5 font-medium">
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-emerald-400">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 text-white font-medium">{exp.description}</td>
                  <td className="py-3 text-slate-300">
                    {exp.vehicle ? (
                      <Link href={`/inventory/${exp.vehicle.id}`} className="hover:text-emerald-400">
                        {exp.vehicle.year} {exp.vehicle.make} {exp.vehicle.model}
                      </Link>
                    ) : (
                      'Dealership Lot'
                    )}
                  </td>
                  <td className="py-3 text-slate-400 font-mono">{formatDate(exp.date)}</td>
                  <td className="py-3 text-right font-mono font-bold text-white">
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
