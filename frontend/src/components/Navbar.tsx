import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, Sparkles, Sun, Moon, Menu, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick, onMenuClick }) => {
  const [isDark, setIsDark] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check initial theme from document element or localStorage
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0d121f]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between shrink-0 relative z-30 transition-colors duration-200">
      {/* Left controls for Mobile */}
      <div className="flex items-center gap-3 md:hidden">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
          IntelliStore <span className="text-blue-600">AI</span>
        </span>
      </div>

      {/* Central Search Bar - Google Drive / Vercel style */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
        <div 
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-sm cursor-pointer transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="truncate">Search files, semantic embeddings, or ask AI...</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 font-medium">AI Semantic</span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Mobile search icon */}
        <button 
          onClick={onSearchClick}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Security status pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Trust AES-256</span>
        </div>

        {/* AI Agent Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-500" />
          <span>LangGraph Supervisor</span>
        </div>

        {/* Theme Toggle Button (Light/Dark Mode) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-all shadow-2xs"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Bell */}
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 relative transition-all shadow-2xs">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative pl-2 md:pl-3 border-l border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
              JA
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">Jyothis Admin</p>
              <p className="text-[10px] text-slate-400 font-medium">Org Administrator</p>
            </div>
            <ChevronDown className="hidden xl:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Jyothis Admin</p>
                <p className="text-[11px] text-slate-400 truncate">admin@intellistore.ai</p>
                <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                  Enterprise Plan
                </span>
              </div>

              <div className="py-1">
                <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5">
                  <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                  Organization Settings
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1 mt-1">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Demo Mode: Zero-Trust Redis session logout triggered. Re-authenticating automatically.");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Log Out (Zero-Trust)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
