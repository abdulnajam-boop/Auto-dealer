'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Car,
  User,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  ArrowRight,
  Plus,
} from '@/components/icons';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import { formatDateTime, formatDate } from '@/lib/utils';

export function AppointmentsClient({ initialAppointments }: { initialAppointments: any[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdatingId(null);
    }
  };

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
      {initialAppointments.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No appointments scheduled</h3>
          <p className="text-xs text-slate-400">Test drive bookings from your storefront will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialAppointments.map((apt) => {
            const customerName = apt.lead?.name || 'Storefront Buyer';
            const customerPhone = apt.lead?.phone || null;
            const customerEmail = apt.lead?.email || null;

            return (
              <div
                key={apt.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                      {(apt.appointmentType || 'TEST_DRIVE').replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">{customerName}</h3>
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
                  {customerPhone && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{customerPhone}</span>
                    </div>
                  )}
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    &ldquo;{apt.notes}&rdquo;
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {apt.status === 'SCHEDULED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                        disabled={updatingId === apt.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-[11px] font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                    {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                        disabled={updatingId === apt.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold"
                      >
                        Complete
                      </button>
                    )}
                  </div>

                  {apt.vehicle && (
                    <Link
                      href={`/deals?vehicleId=${apt.vehicle.id}&buyerName=${encodeURIComponent(customerName)}`}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Start Deal →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
