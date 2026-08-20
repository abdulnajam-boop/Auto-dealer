'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dealer/Sidebar';
import { Header } from '@/components/dealer/Header';
import { CommandPalette } from '@/components/dealer/CommandPalette';
import { AiAssistantDrawer } from '@/components/dealer/AiAssistantDrawer';
import { NotificationsDrawer } from '@/components/dealer/NotificationsDrawer';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif_1',
      title: 'New Lead: Emily Rodriguez',
      message: 'Offer of $23,500 received for 2022 Toyota Camry SE. VIP Test drive scheduled.',
      type: 'SUCCESS',
      linkUrl: '/leads',
      createdAt: new Date(),
      isRead: false,
    },
    {
      id: 'notif_2',
      title: 'Auction Watchlist Alert',
      message: '2022 Toyota Camry SE Nightshade (Manheim Dallas) runs tomorrow at 2:00 PM.',
      type: 'INFO',
      linkUrl: '/auctions',
      createdAt: new Date(),
      isRead: false,
    },
    {
      id: 'notif_3',
      title: 'Aged Inventory Review',
      message: '2020 BMW 330i has reached 51 days in inventory. Review recommended price adjustment.',
      type: 'WARNING',
      linkUrl: '/inventory',
      createdAt: new Date(),
      isRead: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenAssistant={() => setAssistantOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          unreadNotificationsCount={3}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Drawers & Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <AiAssistantDrawer
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}
