import React from 'react';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { Settings } from '@/components/icons';
import { SettingsClient } from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const tenant = await getTenantContext();

  const [org, members, branding, invitations] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: tenant.organizationId },
    }),
    prisma.organizationMember.findMany({
      where: { organizationId: tenant.organizationId },
      include: { user: true },
    }),
    prisma.dealerBranding.findUnique({
      where: { organizationId: tenant.organizationId },
    }),
    prisma.userInvitation.findMany({
      where: { organizationId: tenant.organizationId },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            Dealership Settings &amp; AI Policies
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-tenant organization profile, F&amp;I fee defaults, staff user management, and AI negotiation guardrails.
          </p>
        </div>
      </div>

      <SettingsClient
        org={org}
        members={members}
        branding={branding}
        invitations={invitations}
        currentRole={tenant.role}
      />
    </div>
  );
}
