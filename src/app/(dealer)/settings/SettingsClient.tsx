'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building,
  DollarSign,
  Bot,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Lock,
} from '@/components/icons';

interface SettingsClientProps {
  org: any;
  members: any[];
  branding: any;
  invitations: any[];
  currentRole: string;
}

export function SettingsClient({
  org,
  members: initialMembers,
  branding,
  invitations: initialInvitations,
  currentRole,
}: SettingsClientProps) {
  const [members, setMembers] = useState(initialMembers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'SALES' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const isOwnerOrAdmin = ['OWNER', 'ADMIN'].includes(currentRole);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/settings/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Successfully added ${inviteForm.name} to the dealership staff.`);
        setInviteModalOpen(false);
        setInviteForm({ name: '', email: '', role: 'SALES' });
        // Refresh page state
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to invite member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/settings/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setMembers(members.map((m) => (m.userId === userId ? { ...m, role: newRole } : m)));
        setSuccessMsg('User role updated successfully.');
      }
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user from the dealership?')) return;

    try {
      const res = await fetch(`/api/settings/team?userId=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMembers(members.filter((m) => m.userId !== userId));
        setSuccessMsg('User removed successfully.');
      }
    } catch (err) {
      console.error('Failed to remove user:', err);
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dealership Profile & Branded Storefront */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Dealership Profile & Branding</h2>
            </div>
            <Link
              href={`/dealer/${org?.slug || 'apex-motors'}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
            >
              <span>View Public Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Dealership Legal Name</label>
              <input
                type="text"
                readOnly
                defaultValue={org?.name || 'Apex Auto Gallery'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Dealership URL Slug</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={org?.slug || 'apex-motors'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Phone Number</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={org?.phone || '(512) 555-0199'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Physical Lot Address</label>
              <input
                type="text"
                readOnly
                defaultValue={`${org?.address || '4500 Auto Mall Pkwy'}, ${org?.city || 'Austin'}, ${org?.state || 'TX'} ${org?.zip || '78759'}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* F&I Fee & Pricing Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">F&I Defaults & Tax Structure</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Dealer Doc Fee ($)</label>
                <input
                  type="number"
                  readOnly
                  defaultValue="499"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">State Tax Rate (%)</label>
                <input
                  type="number"
                  readOnly
                  defaultValue="6.25"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Target Gross Profit Margin (%)</label>
              <input
                type="number"
                readOnly
                defaultValue="15"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              These values automatically populate new F&I deals, Buyer's Orders, and financial projections.
            </div>
          </div>
        </div>

        {/* Autonomous AI Sales Agent Guardrails */}
        <div className="rounded-2xl border border-purple-500/30 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">AI Sales Agent Policy Rules</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Autonomous Buyer Auto-Reply</div>
                <div className="text-[11px] text-slate-400">Respond to customer inquiries within seconds</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px]">
                ENABLED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-purple-200 text-xs leading-relaxed space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Hard Invariant Price Floor Rule
              </div>
              <p className="text-[11px] text-slate-400">
                The AI Sales Agent will strictly negotiate between the Asking Price and the Absolute Minimum Floor. Any offer below the minimum is rejected or routed for manual review.
              </p>
            </div>
          </div>
        </div>

        {/* Team Members & RBAC */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Authorized Staff & RBAC</h2>
            </div>
            {isOwnerOrAdmin && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
              >
                <Plus className="w-3 h-3" />
                <span>Invite User</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{m.user.name}</div>
                  <div className="text-[11px] text-slate-400">{m.user.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  {isOwnerOrAdmin && m.role !== 'OWNER' ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="SALES">SALES</option>
                      <option value="INVENTORY">INVENTORY</option>
                      <option value="FINANCE">FINANCE</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                      {m.role}
                    </span>
                  )}

                  {isOwnerOrAdmin && m.role !== 'OWNER' && (
                    <button
                      onClick={() => handleRemoveMember(m.userId)}
                      className="p-1 text-slate-500 hover:text-red-400"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setInviteModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Invite Dealership Team Member
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="elena@apexautogallery.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="ADMIN">ADMIN (Full access + user management)</option>
                  <option value="MANAGER">MANAGER (Approvals, desking, inventory)</option>
                  <option value="SALES">SALES (CRM, leads, chat, listings)</option>
                  <option value="INVENTORY">INVENTORY (Acquisitions, recon, pricing)</option>
                  <option value="FINANCE">FINANCE (F&I contracts, loans, docs)</option>
                  <option value="VIEWER">VIEWER (Read-only)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? 'Sending Invitation...' : 'Confirm & Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
