import React from 'react';
import { StorefrontHeader } from '@/components/storefront/StorefrontHeader';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { StorefrontLiveChat } from '@/components/storefront/StorefrontLiveChat';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
      <StorefrontLiveChat />
    </div>
  );
}
