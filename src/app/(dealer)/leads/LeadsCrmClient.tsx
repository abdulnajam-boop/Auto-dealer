'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Car,
  Calendar,
  MessageSquare,
  DollarSign,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Edit3,
} from '@/components/icons';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

const STAGES = [
  { label: 'New', value: 'NEW', color: 'border-blue-500/40 bg-blue-500/5' },
  { label: 'Contacted', value: 'CONTACTED', color: 'border-purple-500/40 bg-purple-500/5' },
  { label: 'Qualified', value: 'QUALIFIED', color: 'border-teal-500/40 bg-teal-500/5' },
  { label: 'Appointment', value: 'APPOINTMENT', color: 'border-amber-500/40 bg-amber-500/5' },
  { label: 'Negotiating', value: 'NEGOTIATING', color: 'border-orange-500/40 bg-orange-500/5' },
  { label: 'Pending Deal', value: 'PENDING', color: 'border-indigo-500/40 bg-indigo-500/5' },
  { label: 'Sold', value: 'SOLD', color: 'border-emerald-500/40 bg-emerald-500/5' },
  { label: 'Lost', value: 'LOST', color: 'border-slate-700 bg-slate-900/30' },
];

export function LeadsCrmClient({ initialLeads, teamUsers }: { initialLeads: any[]; teamUsers: any[] }) {
  const router = useRouter();
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const handleStageChange = async (leadId: string, newStage: string) => {
    setUpdatingStage(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        router.refresh();
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev: any) => ({ ...prev, stage: newStage }));
        }
      }
    } finally {
      setUpdatingStage(false);
    }
  };

  const handleAssignUser = async (leadId: string, userId: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedToUserId: userId || null }),
    });
    router.refresh();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteText) return;

    setSavingNote(true);
    try {
      const updatedNotes = selectedLead.notes
        ? `${selectedLead.notes}\n[${new Date().toLocaleDateString()}] ${noteText}`
        : `[${new Date().toLocaleDateString()}] ${noteText}`;

      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      if (res.ok) {
        setSelectedLead((prev: any) => ({ ...prev, notes: updatedNotes }));
        setNoteText('');
        router.refresh();
      }
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            CRM Pipeline & Customer Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track inquiries, manage 8-stage sales cycle, schedule test drives, and close vehicle deals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Test Drive Desk</span>
          </Link>
          <Link
            href="/messages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Internal Chat</span>
          </Link>
        </div>
      </div>

      {/* 8-Stage Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = initialLeads.filter((l) => l.stage === stage.value);
          return (
            <div
              key={stage.value}
              className={`rounded-2xl border ${stage.color} p-3 flex flex-col min-w-[220px] lg:min-w-0`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-300 font-bold">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="text-[11px] text-slate-600 text-center py-6">Empty</div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-3 rounded-xl bg-slate-950 border transition-all cursor-pointer space-y-2 ${
                        selectedLead?.id === lead.id
                          ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">
                          {lead.score}/100
                        </span>
                      </div>

                      {lead.vehicle && (
                        <div className="text-[11px] text-emerald-400 font-medium truncate">
                          {lead.vehicle.year} {lead.vehicle.make} {lead.vehicle.model}
                        </div>
                      )}

                      {lead.currentOffer && (
                        <div className="text-[11px] text-slate-300 font-mono">
                          Offer: <strong className="text-white">{formatCurrency(lead.currentOffer)}</strong>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{lead.phone || 'Storefront'}</span>
                        <select
                          value={lead.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(lead.id, e.target.value);
                          }}
                          className="bg-slate-900 border border-slate-800 rounded px-1 py-0.5 text-[10px] text-slate-300"
                        >
                          {STAGES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedLead.name}</h2>
                <StatusBadge status={selectedLead.stage} />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {selectedLead.phone || 'No phone'} • {selectedLead.email || 'No email'} • Lead ID: {selectedLead.id}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLead.assignedToUserId || ''}
                onChange={(e) => handleAssignUser(selectedLead.id, e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="">Unassigned Salesperson</option>
                {teamUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Vehicle of Interest */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Vehicle of Interest</span>
              </h3>
              {selectedLead.vehicle ? (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">
                    {selectedLead.vehicle.year} {selectedLead.vehicle.make} {selectedLead.vehicle.model}
                  </div>
                  <div className="text-slate-400 font-mono">Stock #{selectedLead.vehicle.stockNumber}</div>
                  <div className="text-emerald-400 font-bold font-mono text-sm">
                    Asking: {formatCurrency(selectedLead.vehicle.askingPrice)}
                  </div>
                  <Link
                    href={`/inventory/${selectedLead.vehicle.id}`}
                    className="inline-block text-xs text-purple-400 hover:underline pt-1"
                  >
                    View Vehicle Record →
                  </Link>
                </div>
              ) : (
                <div className="text-slate-500">General dealership inquiry</div>
              )}
            </div>

            {/* Quick Actions & Notes */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>Activity & Staff Notes</span>
              </h3>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto font-sans leading-relaxed">
                {selectedLead.notes || 'No notes added yet.'}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Add note or call summary..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50"
                >
                  Save Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
