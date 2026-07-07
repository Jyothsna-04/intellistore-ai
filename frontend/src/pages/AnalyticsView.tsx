import React from 'react';
import { BarChart3, TrendingDown, Download } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider border border-blue-500/20">
            Enterprise Governance & FinOps
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Cloud Billing & Department Chargebacks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track multi-tenant cost allocation, storage growth velocity, and realized AI savings.
          </p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-2 self-start sm:self-auto shadow-md shadow-blue-500/20">
          <Download className="w-4 h-4" /> Export FinOps Report (.PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Current Month Invoices</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">$1,240.00</p>
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> down $340 from last quarter
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Realized AI Lifecycle Savings</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">$4,820.00</p>
          <p className="text-xs text-slate-400 font-medium">Cumulative YoY cost avoidance</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Forecasted Q4 Spend</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">$820 / mo</p>
          <p className="text-xs text-slate-400 font-medium">After pending cold archive transitions</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" /> Department Cost Allocation Table
        </h3>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
              <th className="py-3 px-4">Department / Tenant</th>
              <th className="py-3 px-4">Storage Volume</th>
              <th className="py-3 px-4">Primary Tier</th>
              <th className="py-3 px-4">Monthly Cost</th>
              <th className="py-3 px-4">AI Optimization Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            <tr>
              <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">Finance & Accounts</td>
              <td className="py-3 px-4">4.8 TB</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">Hot NVMe</span></td>
              <td className="py-3 px-4 font-bold">$410 / mo</td>
              <td className="py-3 px-4"><span className="text-amber-500 font-bold">Action Required ($180 savings)</span></td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">Engineering & R&D</td>
              <td className="py-3 px-4">5.2 TB</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">Cool Pool</span></td>
              <td className="py-3 px-4 font-bold">$445 / mo</td>
              <td className="py-3 px-4"><span className="text-emerald-500 font-bold">Optimized (Deduplication running)</span></td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">Legal & Compliance</td>
              <td className="py-3 px-4">2.4 TB</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">Deep Archive</span></td>
              <td className="py-3 px-4 font-bold">$230 / mo</td>
              <td className="py-3 px-4"><span className="text-emerald-500 font-bold">100% Compliant (7-Yr SOX)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
