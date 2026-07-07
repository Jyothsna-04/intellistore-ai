import React from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  Copy, 
  Snowflake, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  BarChart2,
  PieChart,
  RefreshCw
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      type: 'cost',
      title: 'Archive 2,450 inactive project files from 2024 to COLD tier',
      savings: '$180.50 / month',
      storage: '6.2 TB',
      impact: 'High Impact',
      agent: 'Lifecycle Agent',
      icon: Snowflake,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 2,
      type: 'duplicate',
      title: 'Exact duplicates detected across Engineering and QA shared folders',
      savings: '$145.00 / month',
      storage: '4.8 TB',
      impact: 'High Impact',
      agent: 'Optimization Agent',
      icon: Copy,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 3,
      type: 'security',
      title: 'Quarantine 2 unindexed binaries flagged by ClamAV heuristic scan',
      savings: 'Risk Mitigation',
      storage: '142 MB',
      impact: 'Critical',
      agent: 'Security Agent',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 4,
      type: 'compression',
      title: 'Compress 840 uncompressed application server log archives',
      savings: '$94.50 / month',
      storage: '3.2 TB',
      impact: 'Medium Impact',
      agent: 'Optimization Agent',
      icon: Zap,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            Autonomous Storage Engine Online
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AI Orchestrator Optimization Summary
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Nightly AI scans evaluated <strong className="text-white">1.42 million enterprise files</strong> across all departments. 4 optimization actions are ready for review.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Run Manual AI Scan
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all">
            <Sparkles className="w-4 h-4" />
            Execute All 4 Actions
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Storage Health */}
        <div className="p-5 rounded-2xl glass-card border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Storage Health Score</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">94</span>
            <span className="text-sm text-slate-400">/ 100</span>
            <span className="ml-auto text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+3 pts</span>
          </div>
          <div className="w-full bg-slate-700/40 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        {/* Potential Savings */}
        <div className="p-5 rounded-2xl glass-card border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Monthly Cost Savings</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><TrendingDown className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">$420.00</span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-blue-400 font-semibold">14.2 TB</span> reclaimable storage
          </p>
        </div>

        {/* Duplicate Waste */}
        <div className="p-5 rounded-2xl glass-card border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Duplicate File Waste</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Copy className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">4.8 TB</span>
            <span className="text-xs text-slate-400">(1,420 files)</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">Exact & Semantic</span> duplicates
          </p>
        </div>

        {/* Cold Data Archive */}
        <div className="p-5 rounded-2xl glass-card border border-slate-700/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Cold Data Candidates</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><Snowflake className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">9.4 TB</span>
            <span className="text-xs text-slate-400">(3,800 files)</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">&gt; 180 days</span> unaccessed
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white">AI Agent Recommended Actions</h3>
              <p className="text-xs text-slate-400">Review and apply intelligent storage optimizations generated by the agents</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              4 Pending
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div key={rec.id} className="p-4 rounded-2xl glass-panel border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${rec.color} shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {rec.agent}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          rec.impact === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                          rec.impact === 'High Impact' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {rec.impact}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-slate-100">{rec.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-0.5">
                        <span>Est. Savings: <strong className="text-emerald-400">{rec.savings}</strong></span>
                        <span>Reclaims: <strong className="text-slate-200">{rec.storage}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors">
                      Ignore
                    </button>
                    <button className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors">
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Storage Tiers & Cost Breakdown */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-card border border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                Storage Tier Distribution
              </h3>
              <span className="text-xs text-slate-400">Total: 48.5 TB</span>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="space-y-2">
              <div className="w-full h-4 rounded-xl flex overflow-hidden gap-0.5 bg-slate-800 p-0.5 border border-slate-700">
                <div className="bg-rose-500 h-full rounded-l-lg" style={{ width: '35%' }} title="HOT Tier - 35%"></div>
                <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="WARM Tier - 25%"></div>
                <div className="bg-blue-500 h-full" style={{ width: '25%' }} title="COLD Tier - 25%"></div>
                <div className="bg-indigo-600 h-full rounded-r-lg" style={{ width: '15%' }} title="ARCHIVE Tier - 15%"></div>
              </div>
            </div>

            {/* Tier Legend */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-rose-500"></span>
                  <span className="text-slate-300 font-medium">HOT (NVMe SSD)</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">17.0 TB</span>
                  <span className="text-slate-500 ml-1.5">(35%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                  <span className="text-slate-300 font-medium">WARM (Standard SSD)</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">12.1 TB</span>
                  <span className="text-slate-500 ml-1.5">(25%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-blue-500"></span>
                  <span className="text-slate-300 font-medium">COLD (HDD Object)</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">12.1 TB</span>
                  <span className="text-slate-500 ml-1.5">(25%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-indigo-600"></span>
                  <span className="text-slate-300 font-medium">ARCHIVE (Glacier)</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">7.3 TB</span>
                  <span className="text-slate-500 ml-1.5">(15%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Department Breakdown */}
          <div className="p-5 rounded-2xl glass-card border border-slate-700/50 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              Top Department Usage
            </h3>
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Engineering & DevOps</span>
                  <span className="font-semibold text-white">22.4 TB ($680/mo)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Data Science & AI Models</span>
                  <span className="font-semibold text-white">16.2 TB ($490/mo)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Legal & Compliance</span>
                  <span className="font-semibold text-white">5.8 TB ($175/mo)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
