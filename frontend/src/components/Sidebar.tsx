import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Users, 
  Clock, 
  Star, 
  Trash2, 
  Sparkles, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  HardDrive,
  Database,
  CloudLightning,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

import { isOrgAdminEmail } from '../lib/config';

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen = true, 
  onClose 
}) => {
  const { user } = useAuth();
  const isAdmin = isOrgAdminEmail(user?.email);

  const navGroups: NavGroup[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'explorer', label: 'My Files', icon: FolderGit2 },
        { id: 'shared', label: 'Shared With Me', icon: Users },
        { id: 'recent', label: 'Recent', icon: Clock },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'trash', label: 'Trash', icon: Trash2 },
      ]
    },
    {
      title: 'AI & OPTIMIZATION',
      items: [
        { id: 'ai-center', label: 'AI Recommendations', icon: Sparkles, badge: '4 New', badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' },
        { id: 'optimization', label: 'Optimization Center', icon: Zap },
      ]
    },
    {
      title: 'ENTERPRISE GOVERNANCE',
      items: [
        ...(isAdmin ? [{
          id: 'admin-portal',
          label: 'Admin Portal (Logs & Users)',
          icon: ShieldAlert,
          badge: 'ADMIN',
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
        }] : []),
        { id: 'analytics', label: 'Analytics & Billing', icon: BarChart3 },
        { id: 'security', label: 'Security & ClamAV', icon: ShieldCheck, badge: 'Safe', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' },
        { id: 'activity', label: 'Activity Center', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static top-0 left-0 z-50 h-full w-64 shrink-0 
        bg-white dark:bg-[#0d121f] border-r border-slate-200 dark:border-slate-800/80
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Logo & Branding */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
                IntelliStore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold">AI</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Enterprise SaaS</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.title}
              </p>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (item.id === 'ai-center' && activeTab === 'copilot') || (item.id === 'optimization' && activeTab === 'copilot');
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150
                        ${isActive 
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20 shadow-xs' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Google Drive Inspired Storage Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                Storage Pool
              </span>
              <span className="text-[10px] text-slate-400">28% Full</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-[28%] transition-all duration-500"></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span><b>14.2 TB</b> of 50 TB used</span>
            </div>

            <button 
              onClick={() => handleNavClick('ai-center')}
              className="w-full py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-blue-200/60 dark:border-blue-500/30"
            >
              <Sparkles className="w-3 h-3" />
              Clean Up Storage
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-500" />
              MinIO + Qdrant Active
            </span>
            <span>v1.2.0-PRO</span>
          </div>
        </div>
      </aside>
    </>
  );
};
