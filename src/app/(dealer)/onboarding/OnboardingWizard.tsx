'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Car,
  Layers,
  Zap,
} from '@/components/icons';
import { BrandLogo } from '@/components/brand/BrandLogo';

interface InitialData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string;
  dealerType: string;
  inventorySize: string;
  heroTitle: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  showOwnInventory: boolean;
  showLeaseDeals: boolean;
  showNetworkInventory: boolean;
  showPartnerListings: boolean;
  showCarfaxCta: boolean;
  showFinancingCta: boolean;
  showTradeInCta: boolean;
  showMakeOffer: boolean;
  showScheduleTestDrive: boolean;
  showContactDealer: boolean;
  preferredHistoryProvider: string;
}

export function OnboardingWizard({ initialData }: { initialData: Partial<InitialData> }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<InitialData>({
    name: initialData.name || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    address: initialData.address || '100 Auto Blvd',
    city: initialData.city || 'Austin',
    state: initialData.state || 'TX',
    zip: initialData.zip || '78701',
    website: initialData.website || '',
    dealerType: initialData.dealerType || 'INDEPENDENT',
    inventorySize: initialData.inventorySize || '1-25',
    heroTitle: initialData.heroTitle || `Find Your Next Exceptional Vehicle`,
    tagline: initialData.tagline || 'Quality Vehicles. Trusted Service.',
    primaryColor: initialData.primaryColor || '#10b981',
    accentColor: initialData.accentColor || '#14b8a6',
    showOwnInventory: initialData.showOwnInventory ?? true,
    showLeaseDeals: initialData.showLeaseDeals ?? false,
    showNetworkInventory: initialData.showNetworkInventory ?? false,
    showPartnerListings: initialData.showPartnerListings ?? false,
    showCarfaxCta: initialData.showCarfaxCta ?? true,
    showFinancingCta: initialData.showFinancingCta ?? true,
    showTradeInCta: initialData.showTradeInCta ?? true,
    showMakeOffer: initialData.showMakeOffer ?? true,
    showScheduleTestDrive: initialData.showScheduleTestDrive ?? true,
    showContactDealer: initialData.showContactDealer ?? true,
    preferredHistoryProvider: initialData.preferredHistoryProvider || 'VINAUDIT',
  });

  const handleChange = (field: keyof InitialData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isCompleted: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save dealership settings.');

      router.push(data.redirectUrl || '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center pb-2">
          <BrandLogo variant="full" theme="dark" size="md" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dealership Setup Wizard</h1>
        <p className="text-sm text-slate-400">
          Configure your operational profile, inventory scope, and autonomous sales settings in 5 steps
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { num: 1, label: 'Info' },
          { num: 2, label: 'Profile' },
          { num: 3, label: 'Inventory' },
          { num: 4, label: 'Branding' },
          { num: 5, label: 'Features' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                : step > s.num
                ? 'bg-slate-900 border-slate-700 text-slate-300'
                : 'bg-slate-950/50 border-slate-900 text-slate-600'
            }`}
          >
            <div className="text-xs font-mono font-bold">STEP {s.num}</div>
            <div className="text-xs font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Card Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Dealership Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                1. Dealership Contact & Physical Location
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your legal business name and primary showroom address displayed on buyer documents and storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Dealership Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Direct Sales Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="512-555-0199"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Public Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="sales@dealership.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Showroom Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="100 Auto Blvd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    maxLength={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">ZIP</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    placeholder="78701"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Dealer Profile */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                2. Dealer Classification
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your dealership operational license model.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'INDEPENDENT', title: 'Independent Dealer', desc: 'Pre-owned licensed retail dealership with physical showroom and lot' },
                { id: 'FRANCHISE', title: 'Franchise Dealer', desc: 'OEM franchised dealership selling new & certified pre-owned vehicles' },
                { id: 'WHOLESALE', title: 'Wholesale Dealer', desc: 'Auction-to-dealer and inter-dealer wholesale inventory trader' },
                { id: 'BROKER', title: 'Auto Broker', desc: 'Custom vehicle sourcing and concierge purchasing for retail clients' },
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => handleChange('dealerType', type.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.dealerType === type.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold flex items-center justify-between">
                    <span>{type.title}</span>
                    {formData.dealerType === type.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Inventory Scope */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                3. Inventory Scope
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                What is your approximate active lot size?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: '1-25', label: '1 - 25 Cars' },
                { id: '26-75', label: '26 - 75 Cars' },
                { id: '76-150', label: '76 - 150 Cars' },
                { id: '150+', label: '150+ Cars' },
              ].map((size) => (
                <button
                  type="button"
                  key={size.id}
                  onClick={() => handleChange('inventorySize', size.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    formData.inventorySize === size.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold">{size.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Branding */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                4. Storefront Branding
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize your public dealership microsite tagline and hero banner.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Hero Headline</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Primary Color</label>
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Accent Color</label>
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Features */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                5. Feature & Storefront CTAs
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enable or disable specific customer interactive tools on your public showroom.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { field: 'showOwnInventory', label: 'Show Own Inventory', desc: 'Display lot vehicles on public showroom' },
                { field: 'showCarfaxCta', label: 'Vehicle History CTA', desc: 'Display CARFAX/VinAudit badge on vehicle pages' },
                { field: 'showFinancingCta', label: 'Financing Pre-Qualification', desc: 'Allow online credit and monthly payment applications' },
                { field: 'showTradeInCta', label: 'Trade-In Appraisal Tool', desc: 'Allow customers to submit trade-in details' },
                { field: 'showMakeOffer', label: 'Online Make Offer', desc: 'Allow buyers to submit counter-offers with AI bounds' },
                { field: 'showScheduleTestDrive', label: 'Schedule Test Drive', desc: 'Enable online calendar test drive appointments' },
              ].map((feat) => (
                <label
                  key={feat.field}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(formData as any)[feat.field]}
                    onChange={(e) => handleChange(feat.field as keyof InitialData, e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{feat.label}</div>
                    <div className="text-[11px] text-slate-400">{feat.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save & Launch Dashboard</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
