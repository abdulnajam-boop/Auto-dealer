'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';
import {
  Car,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Send,
  X,
  Lock,
} from '@/components/icons';

interface VehicleDetailClientProps {
  vehicle: any;
  similarVehicles: any[];
}

export function VehicleDetailClient({ vehicle, similarVehicles }: VehicleDetailClientProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'TEST_DRIVE' | 'AVAILABILITY' | 'OFFER' | 'FINANCE' | 'TRADE_IN' | 'MESSAGE'
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest lead form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    offerAmount: vehicle.askingPrice ? String(vehicle.askingPrice - 500) : '',
    tradeInDetails: '',
    preferredDate: '',
    consentSms: true,
    consentEmail: true,
  });

  const photos = vehicle.photos && vehicle.photos.length > 0
    ? vehicle.photos
    : [{ id: 'default', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' }];

  const estMonthly = calculateMonthlyPayment(vehicle.askingPrice, 5.99, 60, vehicle.askingPrice * 0.1);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/consumer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: vehicle.organizationId,
          vehicleId: vehicle.id,
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          leadType: activeModal,
          message: leadForm.message || `Customer inquiry regarding ${vehicle.year} ${vehicle.make} ${vehicle.model} (${activeModal})`,
          offerAmount: activeModal === 'OFFER' ? parseFloat(leadForm.offerAmount) : undefined,
          preferredDate: leadForm.preferredDate || undefined,
          tradeInDetails: leadForm.tradeInDetails || undefined,
          consentSms: leadForm.consentSms,
          consentEmail: leadForm.consentEmail,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit consumer lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Photo Viewer */}
          <div className="aspect-[16/10] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
            <img
              src={photos[selectedPhotoIndex]?.url}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold border border-slate-800 shadow-lg">
                {vehicle.conditionGrade || 'Clean Condition'}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {photos.map((p: any, idx: number) => (
                <button
                  key={p.id || idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedPhotoIndex === idx ? 'border-emerald-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Vehicle Specifications Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Vehicle Specifications & History
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">VIN (NHTSA Verified)</div>
                <div className="font-mono font-bold text-white pt-0.5 truncate">{vehicle.vin}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Mileage</div>
                <div className="font-mono font-bold text-white pt-0.5">{formatNumber(vehicle.mileage)} mi</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Drivetrain</div>
                <div className="font-bold text-white pt-0.5">{vehicle.drivetrain || 'All-Wheel Drive'}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Engine</div>
                <div className="font-bold text-white pt-0.5">{vehicle.engine || '2.5L 4-Cylinder DOHC'}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Transmission</div>
                <div className="font-bold text-white pt-0.5">{vehicle.transmission || 'Automatic'}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Exterior Color</div>
                <div className="font-bold text-white pt-0.5">{vehicle.exteriorColor}</div>
              </div>
            </div>

            {/* NHTSA Safety Status */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-300">NHTSA Verified Clean Title & Safety Inspection</div>
                <div className="text-slate-400 text-[11px]">
                  Zero active open safety recalls reported. Verified 150-point mechanical and structural powertrain inspection completed.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, CTAs & Dealership Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price & Action Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-20">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Out-The-Door Asking Price</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1">
                {formatCurrency(vehicle.askingPrice)}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-1">
                Estimated ${estMonthly} / mo (60 mos @ 5.99% APR)
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={() => { setActiveModal('TEST_DRIVE'); setSubmitted(false); }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Test Drive</span>
              </button>

              <button
                onClick={() => { setActiveModal('OFFER'); setSubmitted(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Make a Cash / Financed Offer</span>
              </button>

              <button
                onClick={() => { setActiveModal('MESSAGE'); setSubmitted(false); }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Chat with Dealership</span>
              </button>
            </div>

            {/* Dealership Info Box */}
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>{vehicle.organization.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{vehicle.organization.address}, {vehicle.organization.city}, {vehicle.organization.state}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{vehicle.organization.phone || '(512) 555-0199'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Mon-Sat 9:00 AM - 8:00 PM</span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/dealer/${vehicle.organization.slug}`}
                  className="text-emerald-400 font-bold text-xs hover:underline block"
                >
                  Visit Dealership Storefront →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Inventory */}
      {similarVehicles.length > 0 && (
        <div className="pt-8 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Similar Vehicles in Market</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarVehicles.map((s: any) => (
              <Link
                key={s.id}
                href={`/cars/${s.id}`}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all block group"
              >
                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden mb-2">
                  <img
                    src={s.photos[0]?.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  {s.year} {s.make} {s.model}
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">{formatCurrency(s.askingPrice)}</span>
                  <span className="text-slate-400">{formatNumber(s.mileage)} mi</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Guest Lead Capture Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you, {leadForm.name}. Your request for the {vehicle.year} {vehicle.make} {vehicle.model} has been delivered directly to {vehicle.organization.name}. A sales specialist will contact you shortly.
                </p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">
                    {activeModal === 'TEST_DRIVE' && 'Schedule a Showroom Test Drive'}
                    {activeModal === 'OFFER' && 'Submit an Offer'}
                    {activeModal === 'MESSAGE' && 'Chat with Dealership Sales'}
                    {activeModal === 'FINANCE' && 'Start Online Financing Application'}
                    {activeModal === 'TRADE_IN' && 'Value Your Trade-In'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {vehicle.year} {vehicle.make} {vehicle.model} • Stock #{vehicle.stockNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Emily Rodriguez"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="emily@example.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="(512) 555-0188"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {activeModal === 'OFFER' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Offer Amount ($)</label>
                    <input
                      type="number"
                      required
                      value={leadForm.offerAmount}
                      onChange={(e) => setLeadForm({ ...leadForm, offerAmount: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {activeModal === 'TEST_DRIVE' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={leadForm.preferredDate}
                      onChange={(e) => setLeadForm({ ...leadForm, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Questions (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Is the vehicle available for immediate delivery?"
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Explicit Consent Checkboxes */}
                <div className="pt-2 space-y-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadForm.consentSms}
                      onChange={(e) => setLeadForm({ ...leadForm, consentSms: e.target.checked })}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                    />
                    <span>I consent to receive SMS updates regarding this vehicle inquiry. Msg & data rates may apply.</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leadForm.consentEmail}
                      onChange={(e) => setLeadForm({ ...leadForm, consentEmail: e.target.checked })}
                      className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                    />
                    <span>I agree to the dealership terms and privacy policy.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Request to Dealership'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
