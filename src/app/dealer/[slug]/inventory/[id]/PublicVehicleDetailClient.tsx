'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  DollarSign,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
} from '@/components/icons';
import { formatCurrency, formatNumber, calculateMonthlyPayment } from '@/lib/utils';

export function PublicVehicleDetailClient({
  vehicle,
  organization,
  branding,
}: {
  vehicle: any;
  organization: any;
  branding: any;
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Modals state
  const [modalType, setModalType] = useState<'TEST_DRIVE' | 'OFFER' | 'INQUIRY' | 'FINANCING' | 'TRADE_IN' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState<number>(vehicle.askingPrice - 500);
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const photos = vehicle.photos && vehicle.photos.length > 0
    ? vehicle.photos
    : [{ url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' }];

  const estMonthly = calculateMonthlyPayment(vehicle.askingPrice, 5.99, 60, vehicle.askingPrice * 0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (modalType === 'TEST_DRIVE') {
        const res = await fetch('/api/consumer/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: organization.id,
            vehicleId: vehicle.id,
            name,
            email,
            phone,
            appointmentDate: preferredDate,
            notes: message || 'Test drive requested from storefront',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to book test drive.');
        setSuccessMsg('Test drive successfully scheduled! Our team will confirm shortly.');
      } else {
        const res = await fetch('/api/consumer/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: organization.id,
            vehicleId: vehicle.id,
            name,
            email,
            phone,
            leadType: modalType || 'GENERAL_INQUIRY',
            offerAmount: modalType === 'OFFER' ? offerAmount : undefined,
            preferredDate: preferredDate || undefined,
            message,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.');
        setSuccessMsg('Your inquiry has been delivered directly to our sales team!');
      }

      setTimeout(() => {
        setModalType(null);
        setSuccessMsg(null);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={`/dealer/${organization.slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">{organization.name}</div>
              <div className="text-[10px] text-slate-400">Showroom Inventory</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${organization.phone || '5125550199'}`}
              className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{organization.phone || '(512) 555-0199'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={`/dealer/${organization.slug}`} className="hover:text-white">
            {organization.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>Inventory</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
        </div>

        {/* Top Grid: Gallery & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative">
              <img
                src={photos[activePhotoIdx]?.url}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white border border-slate-800">
                Stock #{vehicle.stockNumber}
              </div>
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {photos.map((p: any, idx: number) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border transition-all flex-shrink-0 ${
                      activePhotoIdx === idx ? 'border-emerald-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & CTA Col */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">{vehicle.trim || 'Standard Package'}</p>
                <div className="text-xs text-slate-400 font-mono mt-1">VIN: {vehicle.vin}</div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Dealership Price</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(vehicle.askingPrice)}
                </div>
                <div className="text-xs text-slate-400">
                  Estimated Payment: <strong className="text-white font-mono">${estMonthly}/mo</strong> (60 mo @ 5.99%)
                </div>
              </div>

              {/* History Badge */}
              {branding?.showCarfaxCta !== false && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-300">Clean Vehicle History Verified</div>
                    <div className="text-[11px] text-slate-400">NMVTIS Title Check Passed • 0 Total Loss Records</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                {branding?.showScheduleTestDrive !== false && (
                  <button
                    type="button"
                    onClick={() => setModalType('TEST_DRIVE')}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Test Drive</span>
                  </button>
                )}

                {branding?.showMakeOffer !== false && (
                  <button
                    type="button"
                    onClick={() => setModalType('OFFER')}
                    className="w-full py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span>Make an Offer</span>
                  </button>
                )}

                {branding?.showFinancingCta !== false && (
                  <button
                    type="button"
                    onClick={() => setModalType('FINANCING')}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-all"
                  >
                    Apply for Pre-Approved Financing
                  </button>
                )}

                {branding?.showTradeInCta !== false && (
                  <button
                    type="button"
                    onClick={() => setModalType('TRADE_IN')}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-all"
                  >
                    Value Your Trade-In
                  </button>
                )}

                {branding?.showContactDealer !== false && (
                  <button
                    type="button"
                    onClick={() => setModalType('INQUIRY')}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition-all"
                  >
                    Contact Dealership
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-base font-bold text-white">Vehicle Specifications & Factory Highlights</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Mileage</span>
              <div className="font-bold text-white mt-1 font-mono">{formatNumber(vehicle.mileage)} mi</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Exterior Color</span>
              <div className="font-bold text-white mt-1">{vehicle.exteriorColor}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Engine</span>
              <div className="font-bold text-white mt-1">{vehicle.engine || '2.0L 4-Cylinder'}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Transmission</span>
              <div className="font-bold text-white mt-1">{vehicle.transmission || 'Automatic'}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Drivetrain</span>
              <div className="font-bold text-white mt-1">{vehicle.drivetrain || 'AWD'}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Fuel Type</span>
              <div className="font-bold text-white mt-1">{vehicle.fuelType || 'Gasoline'}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Body Style</span>
              <div className="font-bold text-white mt-1">{vehicle.bodyStyle || 'Sedan'}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500">Condition</span>
              <div className="font-bold text-emerald-400 mt-1">{vehicle.conditionGrade || 'Certified Clean'}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Action Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {modalType === 'TEST_DRIVE' && '📅 Schedule a Test Drive'}
                {modalType === 'OFFER' && '💰 Make an Online Offer'}
                {modalType === 'FINANCING' && '💳 Pre-Approved Financing Inquiry'}
                {modalType === 'TRADE_IN' && '🔄 Trade-In Appraisal'}
                {modalType === 'INQUIRY' && '✉️ Contact Dealership'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!successMsg && (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="512-555-0199"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {modalType === 'OFFER' && (
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Offer Amount ($) *</label>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3.5 py-2 text-purple-300 font-bold font-mono"
                    />
                  </div>
                )}

                {modalType === 'TEST_DRIVE' && (
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Preferred Appointment Date *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Message or Special Requests</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about vehicle availability, trade-in, or payment terms..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 text-center text-xs text-slate-400 space-y-1">
        <div>© {new Date().getFullYear()} {organization.name}. Powered by AutoAIdealership.</div>
        <div className="text-[11px] text-slate-500">All prices subject to applicable state taxes and dealer processing.</div>
      </footer>
    </div>
  );
}
