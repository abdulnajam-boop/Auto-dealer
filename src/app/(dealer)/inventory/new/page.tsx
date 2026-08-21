'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Plus,
} from '@/components/icons';

export default function AddVehiclePage() {
  const router = useRouter();

  const [vin, setVin] = useState('');
  const [decoding, setDecoding] = useState(false);
  const [decodeSource, setDecodeSource] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    stockNumber: '',
    year: 2022,
    make: '',
    model: '',
    trim: '',
    mileage: 35000,
    exteriorColor: 'Midnight Black',
    interiorColor: 'Black Leather',
    engine: '2.5L 4-Cylinder',
    transmission: '8-Speed Automatic',
    drivetrain: 'FWD',
    fuelType: 'Gasoline',
    bodyStyle: 'Sedan',
    doors: 4,
    purchasePrice: 18500,
    purchaseSource: 'MANHEIM',
    askingPrice: 23900,
    preferredPrice: 22900,
    minPrice: 20500,
    status: 'READY',
    conditionGrade: 'CLEAN',
    notes: 'Inspected and certified front-line inventory ready for showroom.',
    photoUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDecode = async () => {
    if (!vin || vin.trim().length < 11) {
      setDecodeError('Please enter a valid 17-character VIN.');
      return;
    }

    setDecoding(true);
    setDecodeError(null);

    try {
      const res = await fetch('/api/vin/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vin.trim().toUpperCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to decode VIN.');

      setDecodeSource(data.source || 'NHTSA_LIVE_API');
      setFormData((prev) => ({
        ...prev,
        stockNumber: prev.stockNumber || `STK-${vin.trim().slice(-6).toUpperCase()}`,
        year: data.year || prev.year,
        make: data.make || prev.make,
        model: data.model || prev.model,
        trim: data.trim || prev.trim,
        engine: data.engine || prev.engine,
        transmission: data.transmission || prev.transmission,
        drivetrain: data.drivetrain || prev.drivetrain,
        fuelType: data.fuelType || prev.fuelType,
        bodyStyle: data.bodyStyle || prev.bodyStyle,
        doors: data.doors || prev.doors,
      }));
    } catch (err: any) {
      setDecodeError(err.message || 'VIN decode failed. Please enter specifications manually.');
    } finally {
      setDecoding(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin) {
      setSaveError('VIN is required.');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        vin: vin.trim().toUpperCase(),
        ...formData,
        photos: formData.photoUrl ? [{ url: formData.photoUrl, isCover: true }] : [],
      };

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save vehicle.');

      router.push(data.redirectUrl || `/inventory/${data.vehicle?.id || ''}`);
      router.refresh();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to intake vehicle.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/inventory"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              Intake Vehicle to Lot
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter 17-character VIN for instant factory spec decoding, pricing bounds, and inventory registration
            </p>
          </div>
        </div>
      </div>

      {/* VIN Decode Section Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          1. Vehicle Identification Number (VIN)
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="e.g. 4T1B11HK5NU123456 or 1HGCR2F83MA000000"
              maxLength={17}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={handleDecode}
            disabled={decoding}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            {decoding ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Decode VIN</span>
              </>
            )}
          </button>
        </div>

        {decodeError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{decodeError}</span>
          </div>
        )}

        {decodeSource && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                VIN successfully decoded: <strong>{formData.year} {formData.make} {formData.model} {formData.trim}</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
              Source: {decodeSource}
            </span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {saveError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Specifications Grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            2. Factory Specifications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Year *</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => handleFieldChange('year', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Make *</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={(e) => handleFieldChange('make', e.target.value)}
                placeholder="Toyota"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Model *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => handleFieldChange('model', e.target.value)}
                placeholder="Camry"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Trim</label>
              <input
                type="text"
                value={formData.trim}
                onChange={(e) => handleFieldChange('trim', e.target.value)}
                placeholder="SE"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Engine</label>
              <input
                type="text"
                value={formData.engine}
                onChange={(e) => handleFieldChange('engine', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Transmission</label>
              <input
                type="text"
                value={formData.transmission}
                onChange={(e) => handleFieldChange('transmission', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Drivetrain</label>
              <input
                type="text"
                value={formData.drivetrain}
                onChange={(e) => handleFieldChange('drivetrain', e.target.value)}
                placeholder="FWD / AWD"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Body Style</label>
              <input
                type="text"
                value={formData.bodyStyle}
                onChange={(e) => handleFieldChange('bodyStyle', e.target.value)}
                placeholder="Sedan / SUV"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Acquisition, Mileage & Pricing */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            3. Operational Details & Pricing Bounds
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Stock Number</label>
              <input
                type="text"
                value={formData.stockNumber}
                onChange={(e) => handleFieldChange('stockNumber', e.target.value)}
                placeholder="STK-001"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Odometer Mileage *</label>
              <input
                type="number"
                required
                value={formData.mileage}
                onChange={(e) => handleFieldChange('mileage', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Exterior Color</label>
              <input
                type="text"
                value={formData.exteriorColor}
                onChange={(e) => handleFieldChange('exteriorColor', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Acquisition Source</label>
              <select
                value={formData.purchaseSource}
                onChange={(e) => handleFieldChange('purchaseSource', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="MANHEIM">Manheim Auction</option>
                <option value="ACV">ACV Auctions</option>
                <option value="COPART">Copart Salvage</option>
                <option value="TRADE_IN">Customer Trade-In</option>
                <option value="PRIVATE_PARTY">Private Party Purchase</option>
                <option value="WHOLESALE">Dealer Wholesale</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Purchase Price ($)</label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleFieldChange('purchasePrice', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-emerald-400 font-semibold">Asking Price ($) *</label>
              <input
                type="number"
                required
                value={formData.askingPrice}
                onChange={(e) => handleFieldChange('askingPrice', e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-emerald-400 font-bold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold">Preferred Floor ($)</label>
              <input
                type="number"
                value={formData.preferredPrice}
                onChange={(e) => handleFieldChange('preferredPrice', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-rose-400 font-semibold">Absolute Min Floor ($)</label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={(e) => handleFieldChange('minPrice', e.target.value)}
                className="w-full bg-slate-950 border border-rose-500/50 rounded-xl px-3 py-2 text-rose-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Primary Cover Photo URL */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-400" />
            4. Cover Photo URL
          </h2>
          <input
            type="url"
            value={formData.photoUrl}
            onChange={(e) => handleFieldChange('photoUrl', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/inventory"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Vehicle to Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
