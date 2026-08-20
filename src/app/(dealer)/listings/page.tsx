'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Globe,
  Share2,
  Edit3,
  RefreshCw,
  Send,
  Loader2,
  Car,
} from '@/components/icons';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';

interface VehicleOption {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  stockNumber: string;
  askingPrice: number;
  mileage: number;
}

function ListingStudioContent() {
  const searchParams = useSearchParams();
  const preselectedVehicleId = searchParams.get('vehicleId');

  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Listing fields
  const [headline, setHeadline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [featureBullets, setFeatureBullets] = useState<string[]>([]);
  const [facebookCopy, setFacebookCopy] = useState('');
  const [craigslistCopy, setCraigslistCopy] = useState('');
  const [socialCopy, setSocialCopy] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FACEBOOK' | 'CRAIGSLIST' | 'SOCIAL' | 'SEO'>('OVERVIEW');
  const [listingId, setListingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vehicles');
      if (res.ok) {
        const data: VehicleOption[] = await res.json();
        setVehicles(data);
        if (preselectedVehicleId && data.some((v) => v.id === preselectedVehicleId)) {
          setSelectedVehicleId(preselectedVehicleId);
          handleGenerate(preselectedVehicleId);
        } else if (data.length > 0) {
          setSelectedVehicleId(data[0].id);
          handleGenerate(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (vehId?: string) => {
    const targetId = vehId || selectedVehicleId;
    if (!targetId) return;

    setGenerating(true);
    try {
      const res = await fetch('/api/listings/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: targetId }),
      });
      if (res.ok) {
        const data = await res.json();
        const copy = data.copy;
        setListingId(data.listing?.id || null);
        setHeadline(copy.headline);
        setShortDescription(copy.shortDescription);
        setLongDescription(copy.longDescription);
        setFeatureBullets(copy.featureBullets || []);
        setFacebookCopy(copy.facebookCopy);
        setCraigslistCopy(copy.craigslistCopy);
        setSocialCopy(copy.socialCopy);
        setHashtags(copy.hashtags || []);
        setSeoTitle(copy.seoTitle);
        setSeoDescription(copy.seoDescription);
      }
    } catch (err) {
      console.error('Failed to generate copy:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishAll = async () => {
    if (!selectedVehicleId || !listingId) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/marketplaces/publish-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          listingId,
        }),
      });
      if (res.ok) {
        alert('Listing published successfully across connected marketplaces!');
      }
    } catch (err) {
      console.error('Failed to publish:', err);
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Listing Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded multi-format automotive copywriting with 1-click marketplace syndication.
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              handleGenerate(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.year} {v.make} {v.model} {v.trim || ''} (#{v.stockNumber})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={generating}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            disabled={publishing || !listingId}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Approve & Publish Everywhere</span>
          </button>
        </div>
      </div>

      {/* Editor Tabs & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Studio */}
        <div className="lg:col-span-2 space-y-4">
          {/* Format Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'OVERVIEW'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Story & Highlights
            </button>
            <button
              onClick={() => setActiveTab('FACEBOOK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'FACEBOOK'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facebook Marketplace
            </button>
            <button
              onClick={() => setActiveTab('CRAIGSLIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'CRAIGSLIST'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Craigslist Motors
            </button>
            <button
              onClick={() => setActiveTab('SOCIAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'SOCIAL'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Social & Reels
            </button>
            <button
              onClick={() => setActiveTab('SEO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'SEO'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEO Meta
            </button>
          </div>

          {/* Active Tab Editor Body */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Listing Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Elevator Hook / Short Description</label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Vehicle Narrative Story</label>
                  <textarea
                    rows={7}
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Key Feature Bullet Points</label>
                  <div className="space-y-1.5">
                    {featureBullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...featureBullets];
                            updated[idx] = e.target.value;
                            setFeatureBullets(updated);
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'FACEBOOK' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Facebook Marketplace Optimized Copy</span>
                  <button
                    onClick={() => copyToClipboard(facebookCopy, 'FB')}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedTab === 'FB' ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
                <textarea
                  rows={9}
                  value={facebookCopy}
                  onChange={(e) => setFacebookCopy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {activeTab === 'CRAIGSLIST' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Craigslist BBCode / Clean Template</span>
                  <button
                    onClick={() => copyToClipboard(craigslistCopy, 'CL')}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedTab === 'CL' ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
                <textarea
                  rows={9}
                  value={craigslistCopy}
                  onChange={(e) => setCraigslistCopy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {activeTab === 'SOCIAL' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Instagram / TikTok Caption & Hashtags</span>
                  <button
                    onClick={() => copyToClipboard(`${socialCopy}\n\n${hashtags.join(' ')}`, 'SOCIAL')}
                    className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedTab === 'SOCIAL' ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={socialCopy}
                  onChange={(e) => setSocialCopy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Hashtags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-purple-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SEO' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Title (&lt;60 chars)</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Description (&lt;155 chars)</label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Preview Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Listing Preview Card
            </h2>

            {selectedVehicle && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden space-y-3 p-4">
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {formatCurrency(selectedVehicle.askingPrice)}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {headline || `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3">
                  {shortDescription || 'Certified pre-owned vehicle with full Carfax inspection report.'}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{formatNumber(selectedVehicle.mileage)} miles</span>
                  <span>Stock #{selectedVehicle.stockNumber}</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authoritative Grounding Rule</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Copy is strictly bound to verified VIN specs and recorded reconditioning repairs. No phantom features are generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingStudioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-xs">
          Loading AI Listing Studio...
        </div>
      }
    >
      <ListingStudioContent />
    </React.Suspense>
  );
}

