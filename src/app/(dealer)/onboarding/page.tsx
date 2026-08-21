import React from 'react';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import { OnboardingWizard } from './OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const tenant = await getTenantContext();
  const org = await prisma.organization.findUnique({
    where: { id: tenant.organizationId },
    include: {
      branding: true,
      locations: { where: { isPrimary: true }, take: 1 },
    },
  });

  const branding = org?.branding;
  const primaryLoc = org?.locations[0];

  const initialData = {
    name: org?.name || '',
    phone: org?.phone || '',
    email: org?.email || '',
    address: primaryLoc?.address || '100 Auto Blvd',
    city: primaryLoc?.city || org?.city || 'Austin',
    state: primaryLoc?.state || org?.state || 'TX',
    zip: primaryLoc?.zip || '78701',
    website: org?.website || '',
    dealerType: org?.dealerType || 'INDEPENDENT',
    inventorySize: org?.inventorySize || '1-25',
    heroTitle: branding?.heroTitle || `Find Your Next Exceptional Vehicle`,
    tagline: branding?.tagline || 'Quality Vehicles. Trusted Service.',
    primaryColor: branding?.primaryColor || '#10b981',
    accentColor: branding?.accentColor || '#14b8a6',
    showOwnInventory: branding?.showOwnInventory ?? true,
    showLeaseDeals: branding?.showLeaseDeals ?? false,
    showNetworkInventory: branding?.showNetworkInventory ?? false,
    showPartnerListings: branding?.showPartnerListings ?? false,
    showCarfaxCta: branding?.showCarfaxCta ?? true,
    showFinancingCta: branding?.showFinancingCta ?? true,
    showTradeInCta: branding?.showTradeInCta ?? true,
    showMakeOffer: branding?.showMakeOffer ?? true,
    showScheduleTestDrive: branding?.showScheduleTestDrive ?? true,
    showContactDealer: branding?.showContactDealer ?? true,
    preferredHistoryProvider: branding?.preferredHistoryProvider || 'VINAUDIT',
  };

  return <OnboardingWizard initialData={initialData} />;
}
