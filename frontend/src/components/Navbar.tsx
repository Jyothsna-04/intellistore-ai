import React from 'react';
import { Search, Bell, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 relative z-10">
      {/* Global Search trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div 
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/80 text-slate-400 text-sm cursor-pointer transition-all shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search files, semantic embeddings, or AI insights...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-700/60 border border-slate-600 rounded">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Security status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Trust Active</span>
        </div>

        {/* AI Agent Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
          <span>5 Agents Online</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            JA
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">Jyothis Admin</div>
            <div className="text-[10px] text-slate-400">Org Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
