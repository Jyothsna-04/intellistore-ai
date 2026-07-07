import React from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  HardDrive, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Users, 
  Clock, 
  Database,
  ChevronRight,
  Zap
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {

  const executiveStats = [
    {
      title: 'Storage Health Score',
      value: '94',
      max: '/ 100',
      change: '+4.2% from last month',
      trend: 'up',
      icon: HardDrive,
      color: 'blue',
      description: 'Optimal distribution across Hot, Cool, and Deep Archive storage tiers.'
    },
    {
      title: 'AI Optimization Score',
      value: '91',
      max: '/ 100',
      change: '14.2 TB recoverable',
      trend: 'up',
      icon: Sparkles,
      color: 'purple',
      description: 'LangGraph multi-agent supervisor has identified 4 actionable savings.'
    },
    {
      title: 'Zero-Trust Security Score',
      value: '99.8',
      max: '/ 100',
      change: '0 breaches detected',
      trend: 'up',
      icon: ShieldCheck,
      color: 'emerald',
      description: '100% of payloads protected by AES-256-GCM & ClamAV malware quarantine.'
    },
    {
      title: 'Monthly Cloud Cost',
      value: '$1,240',
      max: '/mo',
      change: 'Save $420/mo (34%)',
      trend: 'down',
      icon: TrendingDown,
      color: 'amber',
      description: 'Projected Q4 cost reduction after applying pending AI lifecycle policies.'
    }
  ];

  const departmentUsage = [
    { name: 'Finance & Accounts', used: '4.8 TB', percent: 34, color: 'bg-blue-500', cost: '$410/mo', trend: '+2%' },
    { name: 'Engineering & R&D', used: '5.2 TB', percent: 37, color: 'bg-purple-500', cost: '$445/mo', trend: '+8%' },
    { name: 'Human Resources', used: '1.8 TB', percent: 13, color: 'bg-emerald-500', cost: '$155/mo', trend: '-1%' },
    { name: 'Legal & Compliance', used: '2.4 TB', percent: 16, color: 'bg-amber-500', cost: '$230/mo', trend: '+0%' },
  ];

  const recentAiInsights = [
    {
      id: 'REC-101',
      title: 'Migrate 1.2 TB of Q1 financial logs from Hot NVMe to Filebase S3 Deep Archive',
      dept: 'Finance',
      savings: '$180/mo',
      confidence: '99.4%',
      impact: 'High ROI',
      time: '10 mins ago',
      type: 'lifecycle'
    },
    {
      id: 'REC-102',
      title: 'Deduplicate 480 GB of redundant design assets across 3 Engineering buckets',
      dept: 'Engineering',
      savings: '$95/mo',
      confidence: '98.8%',
      impact: 'Immediate',
      time: '1 hour ago',
      type: 'dedup'
    },
    {
      id: 'REC-103',
      title: 'Compress 14 inactive video archives in HR onboarding storage pool',
      dept: 'HR',
      savings: '$65/mo',
      confidence: '97.2%',
      impact: 'Low Risk',
      time: '3 hours ago',
      type: 'compression'
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Executive Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider border border-blue-500/20">
              Executive Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated live via Railway AI Supervisor
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Enterprise Storage Optimization Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Real-time telemetry, predictive AI lifecycle modeling, and Zero-Trust governance across your multi-account cloud topology.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate && onNavigate('explorer')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Database className="w-3.5 h-3.5 text-blue-500" />
            Browse Storage Pools
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('ai-center')}
            className="btn-primary text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Review AI Recommendations
          </button>
        </div>
      </div>

      {/* 4 Key Executive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {executiveStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    {stat.max}
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  {stat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                  {stat.change}
                </p>
              </div>

              <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Department Breakdown & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations Action Center */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  Actionable AI Optimization Insights
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  LangGraph supervisor has evaluated 1.42 million blobs. Click any insight for the 10-question XAI justification panel.
                </p>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('ai-center')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All (4) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentAiInsights.map((insight) => (
                <div 
                  key={insight.id}
                  onClick={() => onNavigate && onNavigate('ai-center')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-blue-500 shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs mt-0.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                          {insight.dept}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {insight.time}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {insight.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{insight.savings}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Confidence: {insight.confidence}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 group-hover:bg-blue-500 group-hover:text-white text-slate-400 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Pilot Lifecycle Enabled</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Nightly scans will automatically index new uploads to Qdrant Vector DB.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                100% Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Department Usage & Chargeback Breakdown */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Department Chargebacks
              </h2>
              <span className="text-xs font-bold text-slate-400">14.2 TB Total</span>
            </div>

            <div className="space-y-4">
              {departmentUsage.map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{dept.used}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {dept.cost}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${dept.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${dept.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button 
                onClick={() => onNavigate && onNavigate('analytics')}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                View Full Chargeback Report <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Storage Simulation Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Digital Twin Simulation
            </div>
            <h3 className="text-sm font-extrabold leading-snug">
              What if you migrate all cold logs to Filebase S3 right now?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Run interactive What-If simulations to forecast your Q4 cloud storage bill before applying lifecycle policies.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('ai-center')}
              className="mt-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              Launch What-If Twin <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
