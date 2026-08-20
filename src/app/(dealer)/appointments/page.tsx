import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { formatDateTime, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import {
  Calendar,
  Clock,
  Car,
  User,
  CheckCircle2,
  Plus,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  const tenant = await getTenantContext();

  const appointments = await prisma.appointment.findMany({
    where: { organizationId: tenant.organizationId },
    include: {
      vehicle: true,
      lead: true,
    },
    orderBy: { scheduledAt: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Appointments & VIP Test Drives
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scheduled vehicle test drives, trade-in appraisals, and delivery handoffs.
          </p>
        </div>
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                  {apt.type.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{apt.customerName}</h3>
              </div>
              <StatusBadge status={apt.status} />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatDateTime(apt.scheduledAt)}</span>
              </div>
              {apt.vehicle && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Car className="w-3.5 h-3.5" />
                  <span>
                    {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}
                  </span>
                </div>
              )}
              {apt.customerPhone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{apt.customerPhone}</span>
                </div>
              )}
            </div>

            {apt.notes && (
              <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/60">
                &ldquo;{apt.notes}&rdquo;
              </p>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <Link
                href="/messages"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Open Chat
              </Link>
              {apt.vehicle && (
                <Link
                  href={`/deals?vehicleId=${apt.vehicle.id}&buyerName=${encodeURIComponent(apt.customerName)}`}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Start Deal →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
