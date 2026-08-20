'use client';

import React from 'react';
import Link from 'next/link';
import { X, Bell, CheckCircle2, AlertTriangle, Info, ArrowRight } from '@/components/icons';
import { formatDate } from '@/lib/utils';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl?: string | null;
  createdAt: Date | string;
  isRead: boolean;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Dealership Alerts & Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              {onMarkAllAsRead && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon =
                  notif.type === 'SUCCESS'
                    ? CheckCircle2
                    : notif.type === 'WARNING'
                    ? AlertTriangle
                    : Info;
                const iconColor =
                  notif.type === 'SUCCESS'
                    ? 'text-emerald-400'
                    : notif.type === 'WARNING'
                    ? 'text-amber-400'
                    : 'text-blue-400';

                return (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-1.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                        <span className="text-xs font-semibold text-white">{notif.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                    {notif.linkUrl && (
                      <Link
                        href={notif.linkUrl}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 pt-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
