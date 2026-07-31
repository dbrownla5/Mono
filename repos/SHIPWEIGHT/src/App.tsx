/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  Package, 
  Truck, 
  Info, 
  AlertCircle, 
  ChevronRight, 
  History,
  TrendingUp,
  DollarSign,
  Weight,
  RefreshCw,
  Layers,
  Settings,
  Download,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { estimateWeightFromDescription, estimateBulkWeights, type WeightEstimate, type BulkEstimateResult } from './lib/gemini';
import { PLATFORMS, COMMON_ITEMS, SHIPPING_PRESETS } from './constants/shippingData';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ViewMode = 'single' | 'bulk';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<WeightEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{description: string, weight: number}[]>([]);

  // Bulk Mode State
  const [niftyApiKey, setNiftyApiKey] = useState('');
  const [niftyProjectId, setNiftyProjectId] = useState('');
  const [bulkItems, setBulkItems] = useState<{id: string, name: string, description: string, price?: number}[]>([]);
  const [bulkResults, setBulkResults] = useState<BulkEstimateResult[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleEstimate = async (e?: React.FormEvent, overrideDescription?: string) => {
    e?.preventDefault();
    const targetDescription = overrideDescription || description;
    if (!targetDescription.trim()) return;

    setIsEstimating(true);
    setError(null);
    try {
      const result = await estimateWeightFromDescription(targetDescription, price ? parseFloat(price) : undefined);
      setEstimate(result);
      setHistory(prev => [{ description: targetDescription, weight: result.typicalWeightOz }, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Failed to estimate weight. Please try again.");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleNiftySync = async () => {
    if (!niftyApiKey || !niftyProjectId) {
      setError("Please provide Nifty API Key and Project ID in settings.");
      return;
    }

    setIsSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/nifty/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: niftyApiKey, projectId: niftyProjectId })
      });

      if (!response.ok) throw new Error(await response.text());
      const items = await response.json();
      setBulkItems(items);
      
      // Automatically start estimation for fetched items
      if (items.length > 0) {
        const results = await estimateBulkWeights(items);
        // Map presets
        const resultsWithPresets = results.map(res => ({
          ...res,
          presets: Object.entries(SHIPPING_PRESETS).map(([platform, presets]) => {
            const bestPreset = presets.find(p => res.typicalWeightOz <= p.maxOz);
            return {
              platform,
              presetName: bestPreset?.name || 'Overweight',
              weightLimitOz: bestPreset?.maxOz || 0,
              cost: bestPreset?.cost || 0
            };
          })
        }));
        setBulkResults(resultsWithPresets);
      }
    } catch (err: any) {
      console.error(err);
      setError(`Nifty Sync Failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const getPlatformCost = (platformName: string, weightOz: number) => {
    const platform = PLATFORMS.find(p => p.name === platformName);
    if (!platform) return null;

    if (platform.flatRate && weightOz <= platform.flatRate.maxWeightLb * 16) {
      return { cost: platform.flatRate.cost, service: 'Flat Rate' };
    }

    const rate = platform.rates.find(r => weightOz >= r.minWeightOz && weightOz <= r.maxWeightOz);
    return rate ? { cost: rate.cost, service: rate.serviceName } : null;
  };

  const formatWeight = (oz: number) => {
    const lbs = Math.floor(oz / 16);
    const remainingOz = (oz % 16).toFixed(1);
    if (lbs > 0) return `${lbs} lb ${remainingOz} oz`;
    return `${remainingOz} oz`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ShipWeight</h1>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('single')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                viewMode === 'single' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Single Item
            </button>
            <button 
              onClick={() => setViewMode('bulk')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                viewMode === 'bulk' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Layers className="w-4 h-4" />
              Bulk Sync
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {viewMode === 'single' ? (
          <>
            {/* Single Item View (Existing Logic) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Estimate Item Weight</h2>
                <p className="text-slate-600">Describe your item in detail (brand, size, material) and our AI will estimate the shipping weight for you.</p>
              </div>

              <form onSubmit={handleEstimate} className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Men's Levi's 501 Jeans Size 34, Heavy Cotton Hoodie..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Item Value (Optional)"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isEstimating || !description.trim()}
                    className="px-8 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    {isEstimating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Estimate</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            <AnimatePresence mode="wait">
              {estimate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Estimated Weight</span>
                        <Weight className="w-5 h-5 text-indigo-200" />
                      </div>
                      <div className="text-4xl font-bold mb-2">{formatWeight(estimate.typicalWeightOz)}</div>
                      <div className="text-indigo-100 text-sm mb-4">Range: {formatWeight(estimate.minWeightOz)} - {formatWeight(estimate.maxWeightOz)}</div>
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 mb-4">
                        <Package className="w-5 h-5 text-indigo-200" />
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Packaging Type</div>
                          <div className="font-semibold">{estimate.packagingType}</div>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-indigo-500/50">
                        <div className="flex items-center gap-2 text-sm text-indigo-100">
                          <Info className="w-4 h-4" />
                          <span>{estimate.reasoning}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Truck className="w-6 h-6 text-indigo-600" />
                        Platform Estimates
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {PLATFORMS.map((platform) => {
                        const rateInfo = getPlatformCost(platform.name, estimate.typicalWeightOz);
                        return (
                          <div key={platform.name} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="space-y-1">
                              <div className="font-bold text-slate-900">{platform.name}</div>
                              <div className="text-sm text-slate-500">{rateInfo?.service || 'N/A'}</div>
                            </div>
                            <div className="text-right">
                              {rateInfo ? (
                                <span className="text-2xl font-bold text-indigo-600">${rateInfo.cost.toFixed(2)}</span>
                              ) : (
                                <span className="text-sm text-red-500 font-medium">N/A</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Bulk Sync View */
          <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-indigo-600" />
                      Nifty Integration
                    </h2>
                    <p className="text-slate-500">Sync your inventory from Nifty to automatically generate shipping presets for all items.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nifty API Key</label>
                      <input 
                        type="password" 
                        value={niftyApiKey}
                        onChange={(e) => setNiftyApiKey(e.target.value)}
                        placeholder="Enter API Key"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project ID</label>
                      <input 
                        type="text" 
                        value={niftyProjectId}
                        onChange={(e) => setNiftyProjectId(e.target.value)}
                        placeholder="Enter Project ID"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleNiftySync}
                    disabled={isSyncing || !niftyApiKey || !niftyProjectId}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                    <span>Sync & Estimate All Items</span>
                  </button>
                </div>

                <div className="w-full md:w-72 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 space-y-4">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    How it works
                  </h4>
                  <ul className="text-sm text-indigo-700 space-y-3">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Fetch items directly from your Nifty project tasks.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>AI analyzes every item in bulk to determine weight.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Get accurate shipping presets for eBay and Poshmark instantly.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {bulkResults.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Bulk Estimation Results ({bulkResults.length} items)
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">Item Name</th>
                        <th className="px-6 py-4">Est. Weight</th>
                        <th className="px-6 py-4">Packaging</th>
                        <th className="px-6 py-4">eBay Preset</th>
                        <th className="px-6 py-4">Poshmark</th>
                        <th className="px-6 py-4">Etsy</th>
                        <th className="px-6 py-4">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bulkResults.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{res.name}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{res.reasoning}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                              {formatWeight(res.typicalWeightOz)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-medium text-slate-600">{res.packagingType}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700">
                              {res.presets.find(p => p.platform === 'eBay')?.presetName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ${res.presets.find(p => p.platform === 'eBay')?.cost.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700">
                              {res.presets.find(p => p.platform === 'Poshmark')?.presetName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ${res.presets.find(p => p.platform === 'Poshmark')?.cost.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700">
                              {res.presets.find(p => p.platform === 'Etsy')?.presetName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ${res.presets.find(p => p.platform === 'Etsy')?.cost.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${res.confidence * 100}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{Math.round(res.confidence * 100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">eBay Guide</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Poshmark Rates</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Etsy Shipping</a>
        </div>
        <p className="text-xs text-slate-400">
          © 2026 ShipWeight Estimator. Powered by Gemini AI. Integration with Nifty API.
        </p>
      </footer>
    </div>
  );
}
