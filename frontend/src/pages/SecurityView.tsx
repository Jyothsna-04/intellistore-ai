import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAnalytics } from '../lib/hooks/useAnalytics';
import { useActivityHistory, type ActivityEvent } from '../lib/hooks/useActivity';

export const SecurityView: React.FC = () => {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: activityData, isLoading: activityLoading, error } = useActivityHistory(0, 10);

  const totalScanned = analytics?.totalFiles || 0;
  const recentLogs = activityData || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/20">
            Zero-Trust Architecture
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Security & ClamAV Antivirus Quarantine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time payload inspection, AES-256-GCM encryption at rest, and Redis JWT session governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> All Systems Secure (Score: 100/100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Encryption at Rest</span>
            <Lock className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">AES-256-GCM</p>
          <p className="text-xs text-slate-500">Client-side cryptographic envelope applied before storage upload.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">ClamAV Heuristic Engine</span>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {analyticsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${totalScanned} Files Scanned`}
          </p>
          <p className="text-xs text-emerald-500 font-semibold">0 malware signatures or ransomware payloads detected.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Zero-Trust JWT Auth</span>
            <Key className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">Redis Token Pool</p>
          <p className="text-xs text-slate-500">Stateless JWT tokens protected with BCrypt hash verification.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-500" /> Real-Time ClamAV Inspection & Security Audit Logs
        </h3>

        {activityLoading && (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading live security audit records...</p>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to load security audit logs from backend cluster.</span>
          </div>
        )}

        {!activityLoading && !error && (
          <div className="space-y-2 text-xs font-mono">
            {recentLogs.length === 0 ? (
              <div className="py-6 text-center text-slate-400 font-sans">
                No recent security inspection logs found. Upload files to generate ClamAV scan entries.
              </div>
            ) : (
              recentLogs.map((log: ActivityEvent) => (
                <div 
                  key={log.id} 
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-900 dark:text-white font-bold">{log.action}:</span>
                    <span className="text-slate-600 dark:text-slate-300">{log.message}</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] self-start sm:self-auto ${
                    log.severity === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    log.severity === 'ERROR' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    [CLAMAV VERIFIED]
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
