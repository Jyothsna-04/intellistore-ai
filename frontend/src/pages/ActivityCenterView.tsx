import React, { useState } from 'react';
import {
  Activity, Shield, ShieldCheck, Database, Server, Cloud, Cpu,
  WifiOff, Filter, RefreshCw,
  Info, Clock, UploadCloud, Share2, Settings, Search as SearchIcon
} from 'lucide-react';
import { useActivityFeed, useActivityHistory, useSystemStatus, type ActivityEvent } from '../lib/hooks/useActivity';

// ── Category icon map ─────────────────────────────────────────────────────────
const categoryIcon: Record<string, React.FC<any>> = {
  Authentication: UploadCloud,
  Storage:        UploadCloud,
  Sharing:        Share2,
  Administration: Settings,
  System:         Cpu,
};

const categoryColor: Record<string, string> = {
  Authentication: 'text-blue-500   bg-blue-500/10   border-blue-500/20',
  Storage:        'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Sharing:        'text-purple-500  bg-purple-500/10  border-purple-500/20',
  Administration: 'text-amber-500   bg-amber-500/10   border-amber-500/20',
  System:         'text-slate-500   bg-slate-500/10   border-slate-500/20',
};

const severityDot: Record<string, string> = {
  INFO:    'bg-slate-400',
  SUCCESS: 'bg-emerald-500',
  WARNING: 'bg-amber-500',
  ERROR:   'bg-rose-500',
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60)  return `${diffSecs}s ago`;
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return date.toLocaleDateString();
}

// ── Event Card ──────────────────────────────────────────────────────────────
const EventCard: React.FC<{ event: ActivityEvent; isNew?: boolean }> = ({ event, isNew }) => {
  const [expanded, setExpanded] = useState(false);
  const CatIcon = categoryIcon[event.category] || Info;
  const catStyle = categoryColor[event.category] || categoryColor.System;

  return (
    <div
      className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm ${
        isNew
          ? 'bg-blue-50/60 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 animate-in fade-in slide-in-from-top-2 duration-300'
          : 'bg-white dark:bg-[#111827] border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg border ${catStyle} shrink-0`}>
          <CatIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${severityDot[event.severity] || severityDot.INFO}`} />
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{event.message}</p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{event.category}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatRelativeTime(event.timestamp)}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              event.status === 'SUCCESS' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>{event.status}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs animate-in fade-in duration-200">
          <div><span className="font-bold text-slate-500">Action:</span> <span className="text-slate-700 dark:text-slate-300">{event.action}</span></div>
          <div><span className="font-bold text-slate-500">User:</span> <span className="text-slate-700 dark:text-slate-300">{event.email}</span></div>
          <div><span className="font-bold text-slate-500">Resource:</span> <span className="text-slate-700 dark:text-slate-300 truncate">{event.resource || '—'}</span></div>
          <div><span className="font-bold text-slate-500">Type:</span> <span className="text-slate-700 dark:text-slate-300">{event.resourceType || '—'}</span></div>
          <div className="col-span-2"><span className="font-bold text-slate-500">Timestamp:</span> <span className="text-slate-700 dark:text-slate-300 font-mono">{new Date(event.timestamp).toISOString()}</span></div>
        </div>
      )}
    </div>
  );
};

// ── System Status Panel ────────────────────────────────────────────────────
const SystemStatusPanel: React.FC = () => {
  const { data: status, isLoading, refetch } = useSystemStatus();

  const services = status ? [
    { key: 'backend',      icon: Server,   ...status.backend },
    { key: 'database',     icon: Database, ...status.database },
    { key: 'cache',        icon: Cpu,      ...status.cache },
    { key: 'objectStore',  icon: Cloud,    ...status.objectStore },
    { key: 'aiService',    icon: Activity, ...status.aiService },
    { key: 'vectorDb',     icon: SearchIcon, ...status.vectorDb },
    { key: 'virusScanner', icon: Shield,   ...status.virusScanner },
  ] : [];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Live System Status
        </h3>
        <button onClick={() => refetch()} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))
        ) : services.map(svc => {
          const Icon = svc.icon;
          const isHealthy = svc.status === 'healthy';
          return (
            <div key={svc.key} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{svc.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-bold ${isHealthy ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isHealthy ? 'Healthy' : 'Warning'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {status && (
        <p className="text-[10px] text-slate-400 font-mono pt-1">
          Checked: {new Date(status.checkedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

// ── Main Activity Center View ─────────────────────────────────────────────
const ALL_CATEGORIES = ['All', 'Authentication', 'Storage', 'Sharing', 'Administration', 'System'];

export const ActivityCenterView: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { liveEvents, connected } = useActivityFeed(true);
  const { data: history = [], isLoading: historyLoading } = useActivityHistory(0, 50);

  // Merge: live events first (deduped), then history
  const seenIds = new Set<string>();
  const allEvents: (ActivityEvent & { isNew?: boolean })[] = [];
  liveEvents.forEach(e => { seenIds.add(e.id); allEvents.push({ ...e, isNew: true }); });
  history.forEach(e => { if (!seenIds.has(e.id)) allEvents.push(e); });

  const filtered = categoryFilter === 'All'
    ? allEvents
    : allEvents.filter(e => e.category === categoryFilter);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Enterprise Activity Center</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time event stream · Audit timeline · System observability
          </p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream Active
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold text-xs flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" /> Connecting...
            </span>
          )}
          <span className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
            {allEvents.length} events
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main event timeline: 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-2">
            {historyLoading && filtered.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No activity events yet.</p>
                <p className="text-xs text-slate-400">Events appear here in real time as users interact with the platform.</p>
              </div>
            ) : (
              filtered.map(event => (
                <EventCard key={event.id} event={event} isNew={event.isNew} />
              ))
            )}
          </div>
        </div>

        {/* Right panel: System Status */}
        <div className="space-y-4">
          <SystemStatusPanel />

          {/* Live stream stats */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Statistics</h3>
            <div className="space-y-2">
              {[
                { label: 'Live Events',    value: liveEvents.length, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Total Events',   value: allEvents.length,  color: 'text-slate-900 dark:text-white' },
                { label: 'Filtered',       value: filtered.length,   color: 'text-slate-600 dark:text-slate-300' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{stat.label}</span>
                  <span className={`font-black text-base ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
