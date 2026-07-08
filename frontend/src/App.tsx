import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider, useAuth } from './lib/hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { StorageExplorerView } from './pages/StorageExplorerView';
import { SearchView } from './pages/SearchView';
import { CopilotView } from './pages/CopilotView';
import { AnalyticsView } from './pages/AnalyticsView';
import { SecurityView } from './pages/SecurityView';
import { SettingsView } from './pages/SettingsView';
import { ActivityCenterView } from './pages/ActivityCenterView';
import { AdminPortalView } from './pages/AdminPortalView';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import './index.css';

// ── Auth gate: show login/register if not authenticated ─────────────────────
type AuthScreen = 'login' | 'register';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginPage onNavigateToRegister={() => setAuthScreen('register')} />;
  }

  return <>{children}</>;
}

// ── Main App Shell ─────────────────────────────────────────────────────────
function AppShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          onSearchClick={() => handleNavigate('search')}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-y-auto relative z-0">
          {activeTab === 'dashboard'  && <DashboardView onNavigate={handleNavigate} />}

          {(activeTab === 'explorer' || activeTab === 'shared' || activeTab === 'recent' ||
            activeTab === 'favorites' || activeTab === 'trash') && (
            <StorageExplorerView initialView={activeTab} />
          )}

          {activeTab === 'search'     && <SearchView />}

          {(activeTab === 'copilot'   || activeTab === 'ai-center') && (
            <CopilotView initialTab="recommendations" />
          )}
          {activeTab === 'optimization' && (
            <CopilotView initialTab="duplicates" />
          )}

          {activeTab === 'analytics'  && <AnalyticsView />}
          {activeTab === 'security'     && <SecurityView />}
          {activeTab === 'settings'     && <SettingsView />}
          {activeTab === 'admin-portal' && <AdminPortalView />}
          {activeTab === 'activity'     && <ActivityCenterView />}
        </main>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate>
          <AppShell />
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
