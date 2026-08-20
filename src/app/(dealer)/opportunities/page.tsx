'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Search,
  Sparkles,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Car,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Gavel,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';

interface Opportunity {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number;
  conditionGrade: string;
  sourceChannel: string;
  currentBid: number;
  buyFee: number;
  transportEstimate: number;
  repairEstimate: number;
  estimatedMarketValue: number;
  targetAcquisitionPrice: number;
  maxRecommendedBid: number;
  expectedSalePrice: number;
  expectedGrossProfit: number;
  expectedRoiPercent: number;
  daysToSellEstimate: number;
  demandScore: number;
  opportunityScore: number;
  recommendation: string;
  status: string;
  convertedVehicleId?: string | null;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [decodingVin, setDecodingVin] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [vin, setVin] = useState('4T1B11HK5NU109283');
  const [year, setYear] = useState('2022');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Camry');
  const [trim, setTrim] = useState('SE');
  const [mileage, setMileage] = useState('32000');
  const [conditionGrade, setConditionGrade] = useState('CLEAN');
  const [sourceChannel, setSourceChannel] = useState('MANHEIM');
  const [currentBid, setCurrentBid] = useState('18500');
  const [repairEstimate, setRepairEstimate] = useState('650');
  const [transportEstimate, setTransportEstimate] = useState('350');

  const [activeAnalysis, setActiveAnalysis] = useState<any | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecodeVin = async () => {
    if (!vin.trim()) return;
    setDecodingVin(true);
    try {
      const res = await fetch('/api/vin/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vin.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.year) setYear(data.year.toString());
        if (data.make) setMake(data.make);
        if (data.model) setModel(data.model);
        if (data.trim) setTrim(data.trim);
      }
    } catch (err) {
      console.error('Failed to decode VIN:', err);
    } finally {
      setDecodingVin(false);
    }
  };

  const handleAnalyze = async (saveToDb = true) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/opportunities/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin,
          year,
          make,
          model,
          trim,
          mileage,
          conditionGrade,
          sourceChannel,
          currentBid,
          repairEstimate,
          transportEstimate,
          saveToDatabase: saveToDb,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAnalysis(data.valuation);
        if (saveToDb) {
          fetchOpportunities();
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConvertWon = async (opportunityId: string) => {
    setConvertingId(opportunityId);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/convert`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        fetchOpportunities();
      }
    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Vehicle Intelligence & Opportunity Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic valuation, auction bidding limits, market comps, and profit projections.
          </p>
        </div>
      </div>

      {/* Sourcing Analyzer Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Live Opportunity Evaluator</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">NHTSA VPIC Grounded</span>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* VIN & Decoder */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">VIN (17 Characters)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="e.g. 4T1B11HK5NU109283"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleDecodeVin}
                disabled={decodingVin}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {decodingVin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Decode</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Make</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Trim</label>
            <input
              type="text"
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Mileage</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Condition Grade</label>
            <select
              value={conditionGrade}
              onChange={(e) => setConditionGrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="EXCELLENT">Excellent (Like New)</option>
              <option value="CLEAN">Clean (Minor Wear)</option>
              <option value="AVERAGE">Average (Normal Road Wear)</option>
              <option value="ROUGH">Rough (Needs Heavy Reconditioning)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Sourcing Source</label>
            <select
              value={sourceChannel}
              onChange={(e) => setSourceChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="MANHEIM">Manheim Auction</option>
              <option value="ACV">ACV Auctions</option>
              <option value="COPART">Copart Clean Title</option>
              <option value="TRADE_IN">Customer Trade-in</option>
              <option value="PRIVATE_PARTY">Private Party Purchase</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Current Bid / Ask ($)</label>
            <input
              type="number"
              value={currentBid}
              onChange={(e) => setCurrentBid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Estimated Repairs ($)</label>
            <input
              type="number"
              value={repairEstimate}
              onChange={(e) => setRepairEstimate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Transport & Fees ($)</label>
            <input
              type="number"
              value={transportEstimate}
              onChange={(e) => setTransportEstimate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleAnalyze(false)}
            disabled={analyzing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Instant Valuation Preview
          </button>
          <button
            type="button"
            onClick={() => handleAnalyze(true)}
            disabled={analyzing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze & Save to Watchlist</span>
          </button>
        </div>

        {/* Result Card Preview */}
        {activeAnalysis && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-slate-950/80 p-5 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-mono">VALUATION ANALYSIS RESULT</span>
                <h3 className="text-lg font-bold text-white">
                  {year} {make} {model} {trim}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Opportunity Score</div>
                  <div className="text-xl font-bold font-mono text-purple-300">
                    {activeAnalysis.opportunityScore}/100
                  </div>
                </div>
                <StatusBadge status={activeAnalysis.recommendation} size="md" />
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400">Est. Retail Value</div>
                <div className="text-base font-bold text-white">
                  {formatCurrency(activeAnalysis.estimatedMarketValue)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400">Target Acquisition</div>
                <div className="text-base font-bold text-amber-400">
                  {formatCurrency(activeAnalysis.targetAcquisitionPrice)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400">Max Rec. Bid</div>
                <div className="text-base font-bold text-white">
                  {formatCurrency(activeAnalysis.maxRecommendedBid)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[11px] text-slate-400">Exp. Gross Profit</div>
                <div className="text-base font-bold text-emerald-400">
                  {formatCurrency(activeAnalysis.expectedGrossProfit)} ({activeAnalysis.expectedRoiPercent}% ROI)
                </div>
              </div>
            </div>

            {/* Comparables Table */}
            {activeAnalysis.comparableListings && activeAnalysis.comparableListings.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-400 mb-2">Regional Market Comparables</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800 pb-1">
                        <th className="pb-1">Listing</th>
                        <th className="pb-1">Dealer</th>
                        <th className="pb-1">Mileage</th>
                        <th className="pb-1">Distance</th>
                        <th className="pb-1">Listed Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {activeAnalysis.comparableListings.map((c: any, i: number) => (
                        <tr key={i} className="py-2">
                          <td className="py-2 font-medium text-white">{c.title}</td>
                          <td className="py-2 text-slate-400">{c.dealer}</td>
                          <td className="py-2">{formatNumber(c.mileage)} mi</td>
                          <td className="py-2">{c.distanceMiles} mi away</td>
                          <td className="py-2 font-semibold text-emerald-400">{formatCurrency(c.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sourcing Watchlist & Existing Opportunities Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Active Sourcing Pipeline & Opportunities</h2>
            <p className="text-xs text-slate-400">Monitored units from auctions, trade-ins, and direct sourcing</p>
          </div>
          <span className="text-xs text-slate-400">{opportunities.length} Total Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2 font-medium">
                <th className="py-2.5">Vehicle</th>
                <th className="py-2.5">VIN</th>
                <th className="py-2.5">Source</th>
                <th className="py-2.5">Current Bid</th>
                <th className="py-2.5">Max Rec Bid</th>
                <th className="py-2.5">Exp. Profit</th>
                <th className="py-2.5">Score</th>
                <th className="py-2.5">Recommendation</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {opp.year} {opp.make} {opp.model} {opp.trim || ''}
                  </td>
                  <td className="py-3 font-mono text-slate-400">{opp.vin.slice(-8)}</td>
                  <td className="py-3 text-slate-300">{opp.sourceChannel}</td>
                  <td className="py-3 text-slate-300">{formatCurrency(opp.currentBid)}</td>
                  <td className="py-3 font-semibold text-amber-400">{formatCurrency(opp.maxRecommendedBid)}</td>
                  <td className="py-3 font-semibold text-emerald-400">{formatCurrency(opp.expectedGrossProfit)}</td>
                  <td className="py-3 font-mono font-bold text-purple-300">{opp.opportunityScore}/100</td>
                  <td className="py-3">
                    <StatusBadge status={opp.recommendation} />
                  </td>
                  <td className="py-3 text-right">
                    {opp.status === 'CONVERTED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        In Inventory
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConvertWon(opp.id)}
                        disabled={convertingId === opp.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all disabled:opacity-50"
                      >
                        {convertingId === opp.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>Won? Convert</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
