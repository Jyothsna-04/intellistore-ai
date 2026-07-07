import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { StorageExplorerView } from './pages/StorageExplorerView';
import { SearchView } from './pages/SearchView';
import { CopilotView } from './pages/CopilotView';
import { AnalyticsView } from './pages/AnalyticsView';
import { SecurityView } from './pages/SecurityView';
import { SettingsView } from './pages/SettingsView';
import './index.css';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-slate-50 dark:bg-[#090d16]">
        {/* Top Navbar with Dark/Light Theme Toggle */}
        <Navbar 
          onSearchClick={() => handleNavigate('search')} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto relative z-0">
          {activeTab === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          
          {(activeTab === 'explorer' || activeTab === 'shared' || activeTab === 'recent' || activeTab === 'favorites' || activeTab === 'trash') && (
            <StorageExplorerView />
          )}

          {activeTab === 'search' && <SearchView />}

          {(activeTab === 'copilot' || activeTab === 'ai-center' || activeTab === 'optimization') && (
            <CopilotView />
          )}
          
          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'security' && <SecurityView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default App;
