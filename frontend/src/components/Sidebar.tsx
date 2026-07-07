import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Search, 
  Bot, 
  ShieldAlert, 
  BarChart3, 
  Settings, 
  HardDrive,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Storage Explorer', icon: FolderGit2 },
    { id: 'search', label: 'Semantic Search', icon: Search },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'AI' },
    { id: 'analytics', label: 'Cost & Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Malware', icon: ShieldAlert },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col h-screen shrink-0 relative z-20">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <HardDrive className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            IntelliStore <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold">AI</span>
          </h1>
          <p className="text-xs text-slate-400">Enterprise Optimizer</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Core Modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage Health Widget in Sidebar */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">Storage Health</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">94 / 100</span>
        </div>
        <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden mb-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '94%' }}></div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AI Optimization saved <strong className="text-slate-200">14.2 TB</strong> ($420/mo) this cycle.
        </p>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/60 text-center">
        <p className="text-[11px] text-slate-500">IntelliStore AI v1.0.0 Enterprise</p>
      </div>
    </aside>
  );
};
