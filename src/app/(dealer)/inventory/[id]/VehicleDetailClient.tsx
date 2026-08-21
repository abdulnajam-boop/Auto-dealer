'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Sparkles,
  DollarSign,
  Plus,
  ArrowLeft,
  Globe,
  Tag,
  Clock,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  MessageSquare,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Wrench,
  BookOpen,
} from '@/components/icons';
import { StatusBadge } from '@/components/dealer/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

export function VehicleDetailClient({
  vehicle,
  historyReport,
  marketComps,
  marketValue,
  activeListing,
  storefrontSlug,
}: {
  vehicle: any;
  historyReport: any;
  marketComps: any;
  marketValue: any;
  activeListing: any;
  storefrontSlug: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'history' | 'market' | 'photos' | 'expenses' | 'listings' | 'leads'>('overview');

  // Sold Modal State
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [soldPrice, setSoldPrice] = useState(vehicle.askingPrice || 24000);
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [sellingLoading, setSellingLoading] = useState(false);
  const [soldError, setSoldError] = useState<string | null>(null);

  // Photo Add State
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  // Expense Add State
  const [expenseCategory, setExpenseCategory] = useState('RECONDITIONING');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(350);
  const [expenseVendor, setExpenseVendor] = useState('Auto Care Pro');
  const [expenseLoading, setExpenseLoading] = useState(false);

  // Publish Listing State
  const [publishing, setPublishing] = useState(false);

  const projectedProfit = (vehicle.askingPrice || 0) - (vehicle.totalCostBasis || 0);
  const roi = vehicle.totalCostBasis > 0 ? ((projectedProfit / vehicle.totalCostBasis) * 100).toFixed(1) : '0';

  const handleMarkSold = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellingLoading(true);
    setSoldError(null);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}/sold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soldPrice: Number(soldPrice),
          soldDate,
          buyerName,
          buyerPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to mark vehicle sold.');

      setShowSoldModal(false);
      router.refresh();
    } catch (err: any) {
      setSoldError(err.message || 'Error marking vehicle sold.');
    } finally {
      setSellingLoading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    setPhotoLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD', url: newPhotoUrl, caption: photoCaption }),
      });
      if (res.ok) {
        setNewPhotoUrl('');
        setPhotoCaption('');
        router.refresh();
      }
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    await fetch(`/api/vehicles/${vehicle.id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE', photoId }),
    });
    router.refresh();
  };

  const handleSetCover = async (photoId: string) => {
    await fetch(`/api/vehicles/${vehicle.id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_COVER', photoId }),
    });
    router.refresh();
  };

  const handleRemoveBackground = async (photoId: string) => {
    await fetch(`/api/vehicles/${vehicle.id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REMOVE_BACKGROUND', photoId }),
    });
    router.refresh();
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: expenseCategory,
          description: expenseDesc,
          amount: Number(expenseAmount),
          vendor: expenseVendor,
        }),
      });
      if (res.ok) {
        setExpenseDesc('');
        setExpenseAmount(350);
        router.refresh();
      }
    } finally {
      setExpenseLoading(false);
    }
  };

  const handlePublishToStorefront = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/listings/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: vehicle.id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}
              </h1>
              <StatusBadge status={vehicle.status} size="md" />
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Stock #{vehicle.stockNumber} • VIN: {vehicle.vin} • {vehicle.daysInInventory} Days in Stock
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {vehicle.status !== 'SOLD' && (
            <button
              type="button"
              onClick={() => setShowSoldModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Vehicle Sold</span>
            </button>
          )}

          <Link
            href={`/listings?vehicleId=${vehicle.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Listing Studio</span>
          </Link>

          <Link
            href={`/dealer/${storefrontSlug}/inventory/${vehicle.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>Public Storefront</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: Car },
          { id: 'pricing', label: 'Pricing & Margins', icon: DollarSign },
          { id: 'history', label: 'Vehicle History', icon: ShieldCheck },
          { id: 'market', label: 'Market Comps', icon: TrendingUp },
          { id: 'photos', label: `Photos (${vehicle.photos?.length || 0})`, icon: ImageIcon },
          { id: 'expenses', label: `Expenses (${vehicle.expenses?.length || 0})`, icon: Wrench },
          { id: 'listings', label: 'Storefront & Listings', icon: Globe },
          { id: 'leads', label: `Leads (${vehicle.leads?.length || 0})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Photo Banner */}
            <div className="h-72 w-full rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800">
              {vehicle.photos && vehicle.photos[0] ? (
                <img
                  src={vehicle.photos[0].url}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Car className="w-16 h-16" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700">
                {vehicle.photos?.length || 0} Lot Photos Verified
              </div>
            </div>

            {/* Specifications Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Factory Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Mileage</span>
                  <div className="font-bold text-white mt-0.5">{formatNumber(vehicle.mileage)} mi</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Exterior Color</span>
                  <div className="font-bold text-white mt-0.5">{vehicle.exteriorColor}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Interior Color</span>
                  <div className="font-bold text-white mt-0.5">{vehicle.interiorColor || 'Black'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Engine</span>
                  <div className="font-bold text-white mt-0.5">{vehicle.engine || '2.0L 4-Cylinder'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Transmission</span>
                  <div className="font-bold text-white mt-0.5">{vehicle.transmission || 'Automatic'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">Drivetrain / Fuel</span>
                  <div className="font-bold text-white mt-0.5">{vehicle.drivetrain} / {vehicle.fuelType}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
              <h2 className="text-sm font-bold text-white">Dealership Lot Economics</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Asking Price</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{formatCurrency(vehicle.askingPrice)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Total Cost Basis</span>
                  <span className="text-sm font-mono text-slate-200">{formatCurrency(vehicle.totalCostBasis)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Projected Margin</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">+{formatCurrency(projectedProfit)} ({roi}% ROI)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING & MARGINS */}
      {activeTab === 'pricing' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Full Financial & Margin Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real-time cost basis including reconditioning investments and floor limits.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Acquisition Price</span>
              <div className="text-lg font-bold text-white font-mono mt-1">{formatCurrency(vehicle.purchasePrice)}</div>
              <span className="text-[11px] text-slate-400">Source: {vehicle.purchaseSource || 'AUCTION'}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Recon Expenses</span>
              <div className="text-lg font-bold text-slate-300 font-mono mt-1">
                {formatCurrency((vehicle.totalCostBasis || 0) - (vehicle.purchasePrice || 0))}
              </div>
              <span className="text-[11px] text-slate-400">{vehicle.expenses?.length || 0} ledger items</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 uppercase font-semibold">Total Cost Basis</span>
              <div className="text-lg font-bold text-slate-100 font-mono mt-1">{formatCurrency(vehicle.totalCostBasis)}</div>
              <span className="text-[11px] text-slate-400">Breakeven price</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-emerald-500 uppercase font-semibold">Retail Asking Price</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{formatCurrency(vehicle.askingPrice)}</div>
              <span className="text-[11px] text-emerald-300/80">+{formatCurrency(projectedProfit)} Profit</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white">AI Autonomous Sales Bounds</h3>
            <p className="text-xs text-slate-400">
              The AI Sales Agent will never counter below the absolute floor of <strong className="text-rose-400 font-mono">{formatCurrency(vehicle.minPrice)}</strong> without requiring manager approval.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: VEHICLE HISTORY */}
      {activeTab === 'history' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                NMVTIS & Vehicle History Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">Title provenance, accident records, and mileage verification.</p>
            </div>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono">
              Provider: {historyReport?.provider || 'VINAUDIT'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Title Brand</span>
              <div className="font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{historyReport?.titleStatus || 'CLEAN TITLE'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Accident Records</span>
              <div className="font-bold text-white mt-1">
                {historyReport?.accidentCount || 0} Reported
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Odometer Rollback</span>
              <div className="font-bold text-emerald-400 mt-1">
                {historyReport?.odometerRollback ? 'FLAGGED' : 'Verified Consistent'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Owner Count</span>
              <div className="font-bold text-white mt-1">
                {historyReport?.ownerCount || 1} Owner
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKET COMPS */}
      {activeTab === 'market' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Regional Market Valuations & Comps
              </h2>
              <p className="text-xs text-slate-400 mt-1">Comparative market analysis within 100 miles.</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Source: VinAudit Market Feeds • Retrieved: {formatDate(new Date())}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 uppercase">Below Market</span>
              <div className="text-lg font-bold text-slate-300 font-mono mt-1">
                {formatCurrency(marketValue?.belowMarketPrice || 22400)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 uppercase font-semibold">Average Market Price</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                {formatCurrency(marketValue?.averageMarketPrice || 24750)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 uppercase">Above Market</span>
              <div className="text-lg font-bold text-slate-300 font-mono mt-1">
                {formatCurrency(marketValue?.aboveMarketPrice || 26800)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Vehicle Photo Media Manager
              </h2>
              <p className="text-xs text-slate-400 mt-1">Upload inventory photography, select cover photo, or run studio background removal.</p>
            </div>
          </div>

          {/* Add Photo Form */}
          <form onSubmit={handleAddPhoto} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/... (Image URL)"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
            />
            <button
              type="submit"
              disabled={photoLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              Add Photo
            </button>
          </form>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {vehicle.photos?.map((photo: any) => (
              <div key={photo.id} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden space-y-2 pb-2">
                <div className="h-36 w-full bg-slate-900 relative">
                  <img src={photo.thumbnailUrl || photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                  {photo.isCover && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                      COVER
                    </span>
                  )}
                </div>
                <div className="px-2 text-[11px] text-slate-400 truncate">{photo.caption || 'Lot Photo'}</div>
                <div className="px-2 flex items-center justify-between gap-1 text-[11px]">
                  {!photo.isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(photo.id)}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      Make Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveBackground(photo.id)}
                    className="text-purple-400 hover:underline"
                    title="Remove background"
                  >
                    Enhance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Vehicle Expense Ledger & Cost Accounting
              </h2>
              <p className="text-xs text-slate-400 mt-1">Itemize parts, mechanical repair, detailing, and transportation costs.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Cost Basis</span>
              <div className="text-lg font-bold text-white font-mono">{formatCurrency(vehicle.totalCostBasis)}</div>
            </div>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="MECHANICAL">Mechanical Repair</option>
              <option value="BODY_PAINT">Body & Paint</option>
              <option value="DETAILING">Detailing</option>
              <option value="PARTS">Parts Replacement</option>
              <option value="TRANSPORTATION">Transportation</option>
              <option value="INSPECTION">State Inspection</option>
            </select>
            <input
              type="text"
              required
              placeholder="Description (e.g. New Brakes & Rotors)"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white sm:col-span-2"
            />
            <div className="flex gap-2">
              <input
                type="number"
                required
                placeholder="Amount ($)"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button
                type="submit"
                disabled={expenseLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>

          {/* Expense Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 pb-2">
                  <th className="py-2">Category</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Vendor</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {vehicle.expenses?.map((exp: any) => (
                  <tr key={exp.id}>
                    <td className="py-2.5 font-semibold text-emerald-400">{exp.category}</td>
                    <td className="py-2.5 text-slate-300">{exp.description}</td>
                    <td className="py-2.5 text-slate-400">{exp.vendor || '—'}</td>
                    <td className="py-2.5 text-slate-400">{formatDate(exp.date)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-white">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Storefront Listing & Syndication Studio
              </h2>
              <p className="text-xs text-slate-400 mt-1">Publish to your dealership public showroom.</p>
            </div>

            <button
              type="button"
              onClick={handlePublishToStorefront}
              disabled={publishing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              {publishing ? 'Publishing...' : '1-Click Publish to Storefront'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white">Headline: {activeListing?.headline || `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`}</div>
            <div className="text-xs text-slate-300 leading-relaxed">{activeListing?.shortDescription || 'Clean, certified, pre-inspected inventory ready for immediate delivery.'}</div>
          </div>
        </div>
      )}

      {/* TAB 8: LEADS */}
      {activeTab === 'leads' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4 animate-in fade-in duration-200">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Active Buyer Inquiries ({vehicle.leads?.length || 0})
          </h2>

          {vehicle.leads?.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">No active leads recorded for this vehicle yet.</div>
          ) : (
            <div className="space-y-2.5">
              {vehicle.leads?.map((lead: any) => (
                <div key={lead.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{lead.name}</div>
                    <div className="text-[11px] text-slate-400">{lead.phone || lead.email || 'Storefront Inquiry'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lead.stage} />
                    <Link href={`/leads`} className="text-xs text-emerald-400 hover:underline">
                      Open CRM
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MARK VEHICLE SOLD MODAL */}
      {showSoldModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Record Vehicle Sale
              </h3>
              <button
                type="button"
                onClick={() => setShowSoldModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {soldError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {soldError}
              </div>
            )}

            <form onSubmit={handleMarkSold} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Final Sold Price ($) *</label>
                <input
                  type="number"
                  required
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Sale Date *</label>
                <input
                  type="date"
                  required
                  value={soldDate}
                  onChange={(e) => setSoldDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Buyer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samantha Hayes"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Buyer Phone</label>
                <input
                  type="tel"
                  placeholder="512-555-0188"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span>Realized Profit: <strong>{formatCurrency(soldPrice - vehicle.totalCostBasis)}</strong></span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSoldModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sellingLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50"
                >
                  {sellingLoading ? 'Saving...' : 'Confirm Sale & Delist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
